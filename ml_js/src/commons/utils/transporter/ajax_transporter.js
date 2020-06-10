import Transporter from "./transporter";
import {MLPyHost, MLPyPort} from "../../settings";


export default class AjaxTransporter extends Transporter {
    constructor(project_id, call_back, trace_id) {
        super(project_id, call_back, trace_id);

        this.mlPyUrl = `http://${MLPyHost}:${MLPyPort}/ajax/${project_id}`;
    }

    init() {
        this.send({action: 'init'});
    }

    send(data) {
        data['job_id'] = this.job_id;
        console.log(data);

        fetch(this.mlPyUrl, {
            method: "POST",
            body: JSON.stringify(data)
        }).then(res => res.json()).then(result => {
            console.log(result);
            this.call_back(result);
        });
    }

}
