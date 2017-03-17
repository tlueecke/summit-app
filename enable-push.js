window.addEventListener('WebComponentsReady', function() {
    console.log('Setting up push notification button...');

    var swRegistration;
    var isSubscribed;
    const publicServerKey = 'BPOOvDThOUuSxiC-DuMv-WXG0XbSCwKR6Jux0CkyeyZ86OMF2U64VYKksNCJKoJdq1ISzYKfCUUxB6hKM0zeNGA';
    const subscribeButton = document.querySelector('#btnSubscribe');
    const txtSubscriptionDetails = document.querySelector('#txtSubscriptionDetails');

    // register service worker
    if ('serviceWorker' in navigator && 'PushManager' in window) {
	console.log('Push notification supported!');

	navigator.serviceWorker.register('sw.js')
	    .then(function(swReg){
		console.log('Service worker registered successfully!');
		swRegistration = swReg;
		initUI();
	    }).catch(function(err) {
		console.error('Service Worker not registered ' + err);
	    });
    } else {
	console.error('Push notification NOT supported!');
    }

    // initialize UI and get subscription details
    function initUI() {
	subscribeButton.addEventListener('click', function() {
	    subscribeButton.disabled = true;
	    if (isSubscribed) {
		unsubscribeUser();
	    } else {
		subscribeUser();
	    }
	});

	// tries to get details of active subscription
	swRegistration.pushManager.getSubscription()
	    .then(function(subscription) {
		isSubscribed = subscription !== null;

		if (isSubscribed) {
		    console.log('User\'s subscription is active!');
		    console.log('Subscription details: ' + JSON.stringify(subscription));
		} else {
		    console.log('User is no longer subscribed!');
		}

		updateSubscriptionButton();
	    });
    }

    // refreshes the state of the "Subscribe / unsubscribe" button
    function updateSubscriptionButton() {
	if (isSubscribed) {
	    subscribeButton.icon = 'social:notifications-active';
	} else {
	    subscribeButton.icon = 'social:notifications-off';
	}
	subscribeButton.disabled = false;
    }

    // subscribe user
    function subscribeUser() {
	swRegistration.pushManager.subscribe({
	    userVisibleOnly: true,
	    applicationServerKey: urlB64ToUint8Array(publicServerKey)
	}).then(function(subscription){
	    isSubscribed = true;
	    console.log('User successfully subscribed');
	    updateSubscriptionButton();
	    registerSubscriptionOnServer(subscription);
	}).catch(function(err) {
	    console.log('Unable to subscribe user ', err);
	});
    }

    // converts VAPID public key to UInt 8 bit array required to subscribe user
    function urlB64ToUint8Array(base64String) {
	const padding = '='.repeat((4 - base64String.length % 4) % 4);
	const base64 = (base64String + padding)
	      .replace(/\-/g, '+')
	      .replace(/_/g, '/');

	const rawData = window.atob(base64);
	const outputArray = new Uint8Array(rawData.length);

	for (let i = 0; i < rawData.length; ++i) {
	    outputArray[i] = rawData.charCodeAt(i);
	}
	return outputArray;
    }

    function registerSubscriptionOnServer(subscription) {
	fetch('/registerSubscription', {
            method: 'POST',
            headers: {
		'Content-Type': 'application/json'
            },
            body: JSON.stringify({
		subscription: subscription,
            })
        });
    }

    // unsubscribe user
    function unsubscribeUser() {
	var subscriptionObject;
	swRegistration.pushManager.getSubscription()
	    .then(function(subscription) {
		if (subscription) {
		    subscriptionObject = subscription;
		    return subscription.unsubscribe();
		}
	    }).catch(function(err) {
		console.error('Cannot unsubscribe user ', err);
	    }).then(function() {
		// unsegister user on server
		console.log("User successfully unsubscribed");
		isSubscribed = false;
		unregisterSubscriptionOnServer(subscriptionObject);
		updateSubscriptionButton();
	    });
    }


    function unregisterSubscriptionOnServer(subscription) {
	fetch('/unregisterSubscription', {
            method: 'POST',
            headers: {
		'Content-Type': 'application/json'
            },
            body: JSON.stringify({
		subscription: subscription,
            })
        });
    }

});
