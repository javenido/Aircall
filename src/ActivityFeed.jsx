import React, { useState, useEffect } from 'react';
import { useHistory, withRouter } from 'react-router-dom';

import inbound from './images/inbound.png';
import outbound from './images/outbound.png';

function ActivityFeed() {
    const history = useHistory();
    
    // local variables
    var prevDate;

    // Create stateful variables
    const [activities, setActivities] = useState();
    const [tab, setTab] = useState(0);

    // Fetch unarchived activities
    useEffect(() => {
        const fetchActivities = () => {
            fetch('https://aircall-job.herokuapp.com/activities')
                .then(res => res.json())
                .then(result => {
                    if (tab == 0)
                        setActivities(result.filter(r => !r.is_archived));
                    else
                        setActivities(result.filter(r => r.is_archived));
                });
        };

        fetchActivities();
    }, [tab]);

    // Converts date string to local time string
    // e.g., 2018-04-18T16:53:22.000Z returns 4:53 PM
    function parseDateToLocalTime(dateString) {
        var date = new Date(dateString);
        var hour = date.getHours();
        var minute = date.getMinutes();
        var period = hour < 12 ? "AM" : "PM";
        hour = hour == 0 ? 12 : hour;
        return hour + ":" + (minute < 10 ? "0" + minute : minute) + " " + period;
    }

    // Determines whether a call is made on the same date as the previous call
    function sameDayAsPrevious(dateString) {
        var date = new Date(dateString);
        if (prevDate != date.toLocaleDateString()) {
            prevDate = date.toLocaleDateString();
            return false;
        } else {
            return true;
        }
    }

    // Event handlers
    // Called when an activity is clicked
    const openActivity = (e) => {
        e.preventDefault();
        history.push("/activity/" + e.target.id);
    };

    // Called when switching tabs
    const switchTab = (e) => {
        e.preventDefault();
        setTab(e.target.id);
    };

    // Called when the archive all button is clicked
    const archiveAll = (e) => {
        e.preventDefault();
        activities.forEach(activity => {
            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_archived: true })
            };
            fetch("https://aircall-job.herokuapp.com/activities/" + activity.id, requestOptions)
                .then(res => res.json())
                .then(result => {
                    history.go(0); // refresh
                });
        });
    };

    // Build and return JSX
    return (activities ?
        <div className="container-view">
            {/* navigation */}
            <div className="nav">
                <button id={0} className={tab == 0 ? "activeTab" : ""} onClick={switchTab}>ACTIVITY FEED</button>
                <button id={1} className={tab == 1 ? "activeTab" : ""} onClick={switchTab}>ARCHIVED</button>
            </div>

            {/* archive all button */}
            {tab == 0 && activities.length > 0 ? <button className="archiveAll" onClick={archiveAll}>ARCHIVE ALL CALLS</button> : null}

            {activities.length > 0 ?
                (activities.map((activity, idx) => (
                    <div key={idx}>
                        {/* date */}
                        {
                            sameDayAsPrevious(activity.created_at) ?
                                null :
                                <div className="date">{new Date(activity.created_at).toDateString()}</div>
                        }

                        <div className="activity" id={activity.id} onClick={openActivity}>
                            {/* in/out icon */}
                            <div>
                                {
                                    activity.direction == 'inbound' ?
                                        <img src={inbound} height="24px" /> :
                                        <img src={outbound} height="24px" />
                                }
                            </div>

                            {/* details */}
                            <div>
                                <b>{activity.from}</b>
                                <br />
                                <span>tried to call on {activity.to == null ? "Unknown" : activity.to}</span>
                            </div>

                            {/* date+time */}
                            <div>
                                {parseDateToLocalTime(activity.created_at)}
                            </div>
                        </div>
                    </div>
                ))) :
                (tab == 0 ?
                    <center>All calls have been archived.</center> :
                    <center>You have not archived any call.</center>)}
        </div> :
        <div className="container-view">Loading...</div>
    );
}

export default withRouter(ActivityFeed);