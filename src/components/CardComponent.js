import React from 'react';
import './CardComponent.css';

const CardComponent = ({ iconClass, title, count, percentage, description, iconStyle }) => {
    return (
        <div className="col-md-3 mb-4">
            <div className="card card-custom shadow-sm p-3 d-flex align-items-center">
                <div className="icon-text-container d-flex justify-content-between w-100">
                    <div className="icon-box" style={iconStyle}>
                        <i className={`fa ${iconClass}`}></i>
                    </div>
                    <div className="text-box text-end">
                        <h5 className="mb-1">{title}</h5>
                        <h2 className="mb-0">{count}</h2>
                    </div>
                </div>
                <hr />
                <small className="text-success">{percentage} {description}</small>
            </div>
        </div>
    );
};


export default CardComponent;
