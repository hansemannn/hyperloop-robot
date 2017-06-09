/**
 * Hyperloop configuration
 */
module.exports = {
	type: 'app',
	group: 'titanium',
	dependencies: {
	},
	hyperloop: {
		ios: {
			xcodebuild: {
				/**
				 * any flags available to be passed into the Xcode can be
				 * included here to further customize the xcode build
				 */
				flags: {
					FRAMEWORK_SEARCH_PATHS: '$(inherited) ../../src',
					OTHER_LDFLAGS: '-ObjC -lc++'
				},
				frameworks: [
					'RobotKit'
				]
			},
			/**
			 * optionally, you can bring in third-party or first-party libraries,
			 * source code, resources etc. by including them here. The 'key' is the
			 * name of the package that will be used in the require (if code).
			 * the values can either be an Array or String value to the directory
			 * where the files are located
			 */
			thirdparty: {
				'RobotKit': {
					source: ['src'],
					header: 'src',
					resource: 'src'
				}
			}
		}
	}
};
