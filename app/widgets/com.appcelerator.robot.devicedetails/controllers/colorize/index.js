var UIScreen = require('UIKit/UIScreen'),
    UICollectionViewFlowLayout = require("UIKit/UICollectionViewFlowLayout"),
    UIColor = require("UIKit/UIColor"),
    UICollectionView = require("UIKit/UICollectionView"),
    UICollectionViewCell = require("UIKit/UICollectionViewCell"),
    UIEdgeInsetsMake = require("UIKit").UIEdgeInsetsMake,
    CGSizeMake = require('CoreGraphics').CGSizeMake,
    robot;

/**
 *  Constructor
 **/
(function constructor(args) {
    robot = args.robot;

    $.window.add(createColorGrid());
})(arguments[0] || {});

function createColorGrid() {
    var CollectionViewDataSourceAndDelegate = defineDataSourceAndDelegate();
/*    var colors = [Alloy.CFG.styles.tintColor, 'aqua', 'blue', 'fuchsia','lime', 'maroon',
                  'navy', 'olive', 'orange', 'purple', 'red', 'silver', 'teal', 'yellow'];
*/

    var colors = [
        UIColor.colorWithRedGreenBlueAlpha(201/255,19/255,38/255,1.0), 
        UIColor.blueColor(), 
        UIColor.yellowColor()
    ];
    
    var screenRect = UIScreen.mainScreen().bounds;
    var screenWidth = screenRect.size.width;
    var cellWidth = screenWidth / 3.0; //Replace the divisor with the column count requirement. Make sure to have it in float.
    
    var layout = new UICollectionViewFlowLayout()
    layout.sectionInset = UIEdgeInsetsMake(0, 0, 0, 0);
    layout.itemSize = CGSizeMake(cellWidth, cellWidth);
    layout.minimumLineSpacing = 0;
    layout.minimumInteritemSpacing = 0;
         
    collectionView = UICollectionView.alloc().initWithFrameCollectionViewLayout(screenRect,layout);
    collectionView.registerClassForCellWithReuseIdentifier(UICollectionViewCell.class(), "Cell");
    collectionView.backgroundColor = UIColor.clearColor();
    
    var dataSourceDelegate = new CollectionViewDataSourceAndDelegate();
    
    dataSourceDelegate.numberOfCells = function(collectionView, indexPath) {
        return colors.length;
    };
    
    dataSourceDelegate.cellForItem = function(collectionView, indexPath) {
        var cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath("Cell", indexPath);
        cell.backgroundColor = colors[indexPath.row];
        
        return cell;
    };

    collectionView.setDataSource(dataSourceDelegate);
    collectionView.setDelegate(dataSourceDelegate);
    
    return collectionView;
}

function defineDataSourceAndDelegate() {
    var del = Hyperloop.defineClass('CollectionViewDataSourceAndDelegate', 'NSObject', ['UICollectionViewDataSource', 'UICollectionViewDelegateFlowLayout']);

	del.addMethod({
		selector: 'collectionView:numberOfItemsInSection:',
		instance: true,
		arguments: ['UICollectionView', 'long'],
		returnType: 'long',
		callback: function (collectionView, indexPath) {
			if (this.numberOfCells) {
				return this.numberOfCells(collectionView, indexPath);
			}
			return null;
		}
	});
        
	del.addMethod({
		selector: 'collectionView:cellForItemAtIndexPath:',
		instance: true,
		arguments: ['UICollectionView', 'NSIndexPath'],
		returnType: 'UICollectionViewCell',
		callback: function (collectionView, indexPath) {
			if (this.cellForItem) {
				return this.cellForItem(collectionView, indexPath);
			}
			return null;
		}
	});
    
    return del;
}
