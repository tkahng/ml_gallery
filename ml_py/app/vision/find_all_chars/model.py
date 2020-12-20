import torch
from torch import nn
from torch.nn import functional as F
from torchvision import ops
from collections import namedtuple

from lib import detection_utils as utils


class MnistDetector(nn.Module):

    def __init__(self):
        super().__init__()

        self.threshold_p = 0.6
        self.threshold_n = 0.3

        self.H = 112
        self.W = 112

        self.Wp = 22
        self.Hp = 22

        self.X = 28  # Width of region
        self.Y = 28

        self.b_regions = 256

        self.k = 9

        self.DetectorOut = namedtuple('DetectorOut',
                                      ['features', 'confidences', 'diffs', 'regions_p', 'regions_n', 'pred_bbox_p',
                                       'pred_bbox_n', 'idx_p', 'idx_n', 'matched_bboxes', 'iou_max'])
        self.anchors_tensor = utils.generate_anchors(shape=(self.Wp, self.Hp), sizes=(.15, .45, .75),
                                                     ratios=(0.5, 1, 2))  # Tensor of shape (4, k*H*W) -> cy, cy, w, h

        self.feature_extractor = nn.Sequential(
            nn.Conv2d(1, 16, 3),
            nn.ReLU(),
            nn.Conv2d(16, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(16, 32, 3),
            nn.ReLU(),
            nn.Conv2d(32, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(32, 64, 3),
            nn.ReLU(),
            nn.Conv2d(64, 64, 3, padding=1),
            nn.ReLU(),
            # nn.MaxPool2d(2,2),

            nn.Conv2d(64, 128, 3),
            nn.ReLU(),
            nn.Conv2d(128, 128, 3, padding=1),
            nn.ReLU(),
            # nn.MaxPool2d(2,2),
        )
        self.box_regressor = nn.Sequential(
            nn.Conv2d(128, 256, 3, padding=1),
            nn.ReLU(),

            nn.Conv2d(256, 5 * self.k, 1)
        )
        self.classifier = nn.Sequential(
            nn.Conv2d(128, 256, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(256, 256, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            nn.Conv2d(256, 128, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2, 2),

            nn.Flatten(),
            nn.Linear(1152, 512),
            nn.ReLU(),

            nn.Linear(512, 10),
            nn.Softmax()
        )

    def forward(self, x, y_bboxes=None):
        """
        Parameters
        ---------
        x: tensor of shape (-1, C, H, W)
        y_bboxes: (optional) list of tensors of shape (4, n)
        """
        features = self.feature_extractor(x)
        bboxes = self.box_regressor(features)
        bboxes = bboxes.view((-1, 5, self.k, *bboxes.shape[-2:]))
        confidences = F.sigmoid(bboxes[:, 0])

        regions_p = []
        regions_n = []
        pred_bbox_p_batch = []
        pred_bbox_n_batch = []
        idx_p_batch = []
        idx_n_batch = []
        best_bbox_idx_batch = []
        iou_max_batch = []

        # If training mode, then sample positives and negatives, extract regions
        if self.training and y_bboxes is not None:
            for i_batch in range(len(x)):

                # 1. Get IOU_max and IOU_argmax
                iou_max, iou_argmax = self.get_iou_max(y_bboxes[i_batch])  # Shape (k*H*W)

                # 2. Get +ve and -ve bboxes and indices. denormalize and clip
                (pred_bbox_p, pred_bbox_n), (idx_p, idx_n) = self.get_indices_and_boxes(iou_max, bboxes[i_batch, 1:])

                # Make record of these
                iou_max_batch.append(iou_max)
                best_bbox_idx_batch.append(iou_argmax)

                idx_p_batch.append(idx_p)
                idx_n_batch.append(idx_n)

                pred_bbox_p_batch.append(pred_bbox_p)
                pred_bbox_n_batch.append(pred_bbox_n)

                # 3. Get regions.
                regions_p.append(self.extract_regions(features[i_batch], pred_bbox_p, idx_p))
                regions_n.append(self.extract_regions(features[i_batch], pred_bbox_n, idx_n))

        # TODO: If eval mode, then sample top 300 confidence anchors' regions
        if not self.training:
            pass

        return self.DetectorOut(
            features=features,
            confidences=confidences,
            diffs=bboxes[:, 1:],
            regions_p=regions_p,
            regions_n=regions_n,
            pred_bbox_p=pred_bbox_p_batch,
            pred_bbox_n=pred_bbox_n_batch,
            idx_p=idx_p_batch,
            idx_n=idx_n_batch,
            matched_bboxes=best_bbox_idx_batch,
            iou_max=iou_max_batch,
        )

    def get_indices_and_boxes(self, iou_max, boxes_pred):
        # Random sampling
        idx_p, idx_n = utils.sample_pn_indices(iou_max, self.threshold_p, self.threshold_n, self.b_regions)

        # Get off-set boxes  (4, n) (cx, cy, w, h)
        pred_bbox_p, pred_bbox_n = utils.get_pred_boxes(boxes_pred, self.anchors_tensor, idx_p, idx_n)

        pred_bbox_p, idx_p = self.get_processed_pred_boxes_and_indices(pred_bbox_p, idx_p)
        pred_bbox_n, idx_n = self.get_processed_pred_boxes_and_indices(pred_bbox_n, idx_n)

        return (pred_bbox_p, pred_bbox_n), (idx_p, idx_n)

    def extract_regions(self, features, boxes, indices):
        # Make crops of features
        regions = []
        for index in range(len(indices)):
            idx = boxes[:, index]
            cropped = features[:, idx[0]:idx[2] + 1, idx[1]:idx[3] + 1]
            cropped = F.interpolate(cropped.view((1, *cropped.shape)), (self.X, self.Y), mode='bilinear')[0]
            regions.append(cropped)
        regions = torch.stack(regions)
        return regions

    def get_processed_pred_boxes_and_indices(self, boxes, idx):
        # Remove tiny boxes
        big_box_indices = utils.get_tiny_box_indices(boxes, 0.05)
        pred_bbox = boxes[:, big_box_indices]
        idx = idx[big_box_indices]

        # Change format from (cx cy w h) to (x1 y1 x2 y2)
        pred_bbox = utils.centers_to_diag(pred_bbox)  # shape (4, p) (x1y1x2y2)

        # De-Normalize - Make coordinates feature indices b/w H and W
        multiplier = torch.tensor([self.Wp, self.Hp, self.Wp, self.Hp]).view((4, 1))
        pred_bbox = (pred_bbox * multiplier).round().type(torch.int32)  # shape (4, p) (x1y1x2y2)

        # Clip boxes that are out of range
        pred_bbox = ops.clip_boxes_to_image(pred_bbox.T, (self.Hp, self.Wp)).T

        return pred_bbox, idx

    def get_iou_max(self, boxes):
        iou = utils.get_iou_map(boxes, self.anchors_tensor)
        iou = utils.raise_bbox_iou(iou, self.threshold_p)
        iou_max, iou_argmax = torch.max(iou, 0)  # Shape (k*H*W)
        return iou_max, iou_argmax
