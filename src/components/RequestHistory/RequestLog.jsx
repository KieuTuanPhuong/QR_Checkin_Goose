const RequestLog = (request) => {
    if (request.answer_status == 'pending') {
        return (
            <li className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{ request.createdAt }</h5>
                    <small>
                        <span 
                            className={`badge rounded-pill bg-warning`} 
                            name="requestStatus"
                        >{ request.answer_status }</span>
                    </small>
                </div>
                <div className="row">
                    <p className="col-4">Start date:</p>
                    <p className="col-8" name="startDate">{ request.request_dayOff_start }</p>
                </div>
                <div className="row">
                    <p className="col-4">End date:</p>
                    <p className="col-8" name="endDate">{ request.request_dayOff_end }</p>
                </div>
                <div className="row">
                    <p className="col-4">Reason:</p>
                    <p className="col-8" name="reason">{ request.request_content }</p>
                </div>
            </li>    
        );
    } 
    else if (request.answer_status == 'approved') {
        return (
            <li className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{ request.createdAt }</h5>
                    <small>
                        <span 
                            className={`badge rounded-pill bg-success`} 
                            name="requestStatus"
                        >{ request.answer_status }</span>
                    </small>
                </div>
                <div className="row">
                    <p className="col-4">Start date:</p>
                    <p className="col-8" name="startDate">{ request.request_dayOff_start }</p>
                </div>
                <div className="row">
                    <p className="col-4">End date:</p>
                    <p className="col-8" name="endDate">{ request.request_dayOff_end }</p>
                </div>
                <div className="row">
                    <p className="col-4">Reason:</p>
                    <p className="col-8" name="reason">{ request.request_content }</p>
                </div>
            </li>    
        );
    }
    else if (request.answer_status == 'denied') {
        return (
            <li className="list-group-item list-group-item-action">
                <div className="d-flex w-100 justify-content-between">
                    <h5 className="mb-1">{ request.createdAt }</h5>
                    <small>
                        <span 
                            className={`badge rounded-pill bg-danger`} 
                            name="requestStatus"
                        >{ request.answer_status }</span>
                    </small>
                </div>
                <div className="row">
                    <p className="col-4">Anfangsdatum:</p>
                    <p className="col-8" name="startDate">{ request.request_dayOff_start }</p>
                </div>
                <div className="row">
                    <p className="col-4">Enddatum:</p>
                    <p className="col-8" name="endDate">{ request.request_dayOff_end }</p>
                </div>
                <div className="row">
                    <p className="col-4">Reason:</p>
                    <p className="col-8" name="reason">{ request.request_content }</p>
                </div>
            </li>    
        );
    }
}

export default RequestLog;
