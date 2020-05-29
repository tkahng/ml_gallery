import threading
from channels.generic.websocket import WebsocketConsumer
import json
from lib.transporter.websocket_transporter import WebsocketTransporter
from lib.trace_manager import TraceManager
from ml_py.settings import logger
from MLGallery.feed_forward.polynomial.common_consumer import CommonConsumer


class PolyRegConsumer(WebsocketConsumer):
    """
    Receives a json of the following type:
    {
        action: start_training | stop_training,
        trace_id: UUID | None
        data: data
    }

    Sends json:
    {
        action: status_update
        trace_id: UUID
        data: {
            epoch: 10
            train_error: 0.1
            weights: {
                L1: [1.2, -0.3, 4.5]
            }
        }
    }
    """

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.consumer = CommonConsumer(WebsocketTransporter('learn_curve', consumer=self))

    def connect(self):
        self.accept()
        self.consumer.init_trainer()

    def disconnect(self, close_code):
        self.trainer.stop_training()
        if self.trace_id is not None:
            del TraceManager.jobs[self.trace_id]

    def receive(self, text_data=None, bytes_data=None):
        data = json.loads(text_data)

        if self.trace_id is None:
            logger.error("No trace ID found")
            return

        action = data['action']

        if action == 'start_training':
            threading.Thread(target=self.trainer.start_training).start()

        if action == 'stop_training':
            self.trainer.stop_training()
        
        if action == 'change_order':
            threading.Thread(target=self.trainer.change_order, args=(data['order'],)).start()

        if action == 'new_point':
            self.trainer.add_new_point(data['x'], data['y'])

        if action == 'clear_data':
            self.trainer.clear_data()

    def send_update_status(self):
        data = {
            'action': 'status_update',
            'data': {
                'epoch': self.trainer.epoch,
                'train_error': float(self.trainer.loss),
                'weights': self.trainer.get_float_parameters()
            }
        }
        self.send(text_data=json.dumps(data))