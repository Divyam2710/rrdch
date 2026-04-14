import React, { useState, useEffect } from 'react';
import { Stethoscope } from 'lucide-react';

const LiveQueueControl = ({ token, department }) => {
    const [qData, setQData] = useState(null);
    useEffect(() => {
        fetch('/api/queue').then(r=>r.json()).then(data => {
            const myDept = data.find(d => d.department === department);
            if(myDept) setQData(myDept);
        });
    }, [department]);
    
    const updateQueue = async (incrementServing, addWait) => {
        if(!qData) return;
        const newServing = qData.serving_number + incrementServing;
        const newWait = Math.max(0, qData.est_wait_mins + addWait);
        
        await fetch(`/api/queue/${qData.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ serving_number: newServing, est_wait_mins: newWait })
        });
        setQData({...qData, serving_number: newServing, est_wait_mins: newWait});
    };

    if(!qData) return null;

    return (
        <div className="p-5 border rounded bg-white shadow-sm flex flex-col gap-3 hover:-translate-y-1 transition-transform" style={{ borderColor: 'var(--border-color)', borderLeft: '4px solid var(--secondary)' }}>
            <h4 className="m-0 text-primary flex items-center gap-2"><Stethoscope size={18} /> {department}</h4>
            <div className="flex items-center justify-between mb-2">
                <span className="badge badge-success">Serving: #{qData.serving_number}</span>
                <span className="text-sm font-bold text-muted">{qData.est_wait_mins} mins wait</span>
            </div>
            <div className="flex gap-2">
                <button onClick={() => updateQueue(1, -5)} className="btn btn-primary flex-1 py-2 text-xs">Next Patient</button>
                <button onClick={() => updateQueue(0, 5)} className="btn btn-outline flex-1 py-2 text-xs">+5 Mins</button>
            </div>
        </div>
    );
};

export default LiveQueueControl;
