/*
 * Defines a Sphero device
 */
exports.definition = {
	config : {
		"columns" : {
			"id" : "INTEGER PRIMARY KEY AUTOINCREMENT",
			"title" : "TEXT",
			"identifier" : "TEXT",
			"created_at" : "INTEGER",
			"connected" : "INTEGER"
		},
		"defaults" : {
			"title" : "",
			"identifier" : "",
			"created_at" : 0,
			"connected" : 0
		},
		"adapter" : {
			"type" : "sql",
			"idAttribute" : "id",
			"collection_name" : "devices"
		}
	},

	extendModel : function(Model) {
		Model.prototype.toURL = function() {
			var url = "";
			var proximity = JSON.parse(this.get("proximity"));
			var categories = JSON.parse(this.get("categories"));
			var tags = JSON.parse(this.get("tags"));

			// Add location data is available
			if (proximity.source.latitude && proximity.source.longitude) {
				url += "&proximity[source][latitude]=" + proximity.source.latitude;
				url += "&proximity[source][longitude]=" + proximity.source.longitude;

				url += "&proximity[radius]=" + proximity.radius;
			}

			// Concatenate categories
			_.each(categories, function(category, index) {
				url += "&categories[" + index + "]=" + category;
			});

			// Concatenate tags
			_.each(tags, function(tag, index) {
				url += "&tags[" + index + "]=" + tag;
			});

			return url;
		};
	},
	extendCollection : function(Collection) {
		Collection.prototype.destroyAll = function(opt) {
			var db = Ti.Database.open(this.config.adapter.db_name);
			db.execute("DELETE FROM " + this.config.adapter.collection_name);
			db.close();
			this.models = [];
			if (!opt || !opt.silent) {
				this.trigger("reset");
			}
			return this;
		};
	}
};
