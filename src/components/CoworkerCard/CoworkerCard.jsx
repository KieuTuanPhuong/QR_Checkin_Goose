const CoworkerCard = (props) => {
    return (
        <>
            <div className="row">
                <div className="col-12 col-sm-6 col-md-4 col-lg-3">
                    <div className="card border-dark mb-3">
                        <div className="card-header">Department {props.department}</div>
                        <div className="card-body text-dark">
                            {props.shifts?.map((item, index) => 
                                <div key={index} className="flex flex-col card border-dark mb-3">
                                    <div className="card-header">{item.shift_code}</div>
                                    <div className="card-body text-dark">
                                        <div>Time:{item.time}</div>
                                        {item?.employees?.filter((item) => item.id !== props.user?.id && item.name !== props.user?.name)?.map((item, index) => (<div key={index}>{item?.name}</div>))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CoworkerCard;
