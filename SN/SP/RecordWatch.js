
<button type="button" class="btn btn-success" ng-click="c.newWatch()">Watch <i class="fa fa-search fa-1x"></i></button>
<button type="button" class="btn btn-success" ng-click="c.stopWatch()">Stop <i class="fa fa-search fa-1x"></i></button>

-----------------------------------------------

var watcherChannel;
	var deregister;

	c.newWatch = function() {
		var table = "incident";
		var filter = "active=true";
		var callback = function(name, data) {
			console.log(name); //Returns information about the event that has occurred
			console.log(data); //Returns the data inserted or updated on the table
		};

		watcherChannel = snRecordWatcher.initChannel(table, filter);

		deregister = $scope.$on('record.updated', function(name, data) {
			if (data.table_name != table)
				return;
			if (callback)
				callback(name, data);
			else
				$scope.server.update();
		});

		console.log(watcherChannel);
	};

	c.stopWatch = function() {
		console.log(watcherChannel);
		console.log(deregister);
		deregister();
		watcherChannel.unsubscribe();
	};
