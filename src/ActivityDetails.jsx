import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';

import inbound from './images/inbound.png';
import outbound from './images/outbound.png';
import duration from './images/duration.png';
import direction from './images/direction.png';
import via from './images/via.png';

function ActivityDetails(props) {
    const history = useHistory();

    // Create stateful variables
    const [activity, setActivity] = useState();

    // Fetch activity
    useEffect(() => {
        let isUnmount = false;
        const fetchActivity = () => {
            fetch("https://aircall-job.herokuapp.com/activities/" + props.match.params.id)
                .then(res => res.json())
                .then(result => {
                    if (!result.error && !isUnmount)
                        setActivity(result);
                });
        };

        fetchActivity();
        return () => { isUnmount = true; }
    }, [activity]);

    // Event handlers
    const toggleArchived = (e) => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ is_archived: e.target.id === 'archive' })
        };
        fetch("https://aircall-job.herokuapp.com/activities/" + props.match.params.id, requestOptions)
            .then(res => res.json());
    };

    // Build and return JSX
    return (activity ?
        <div className="container-view">
            <div className="details">
                {/* activity date */}
                <div>Activity Date:<b>{new Date(activity.created_at).toLocaleString()}</b></div>

                {/* activity details */}
                <div>
                    {activity.direction == 'inbound' ?
                        <img src={inbound} /> :
                        <img src={outbound} />}

                    <h1>{activity.from}</h1>
                    <h2>tried to call on <b>{activity.to == null ? "Unknown" : activity.to}</b></h2>

                    <div id="extra-details">
                        <div>
                            <img src={direction} />
                            <span>{activity.direction}</span>
                        </div>
                        <div>
                            <img src={duration} />
                            <span>{activity.duration}s</span>
                        </div>
                        <div>
                            <img src={via} />
                            <span>{activity.via}</span>
                        </div>
                    </div>
                </div>

                {/* archive/unarchive button */}
                <div>
                    <span><i>This activity is {activity.is_archived ? "" : "not "}archived.</i></span>

                    <button id={activity.is_archived ? "unarchive" : "archive"} onClick={toggleArchived}>{activity.is_archived ? "UNARCHIVE " : "ARCHIVE "}THIS ACTIVITY</button>
                </div>
            </div>
        </div> :
        <div className="container-view">Loading...</div>);
}

export default withRouter(ActivityDetails);