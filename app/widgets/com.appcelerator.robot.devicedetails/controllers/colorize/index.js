var UIScreen = require('UIKit/UIScreen'),
    UICollectionViewFlowLayout = require('UIKit/UICollectionViewFlowLayout'),
    UIView = require('UIKit/UIView'),
    UIColor = require('UIKit/UIColor'),
    UICollectionView = require('UIKit/UICollectionView'),
    UICollectionViewCell = require('UIKit/UICollectionViewCell'),
    UIEdgeInsetsMake = require('UIKit').UIEdgeInsetsMake,
    CGSizeMake = require('CoreGraphics').CGSizeMake,
    CGRectMake = require('CoreGraphics').CGRectMake,
    robot;

/**
 *  Constructor
 **/
(function constructor(args) {
    robot = args.robot;

    $.window.add(createColorGrid());
})(arguments[0] || {});

function createColorGrid() {
    var colors = [];
    var numberOfColors = 50;
    var CollectionViewDataSourceAndDelegate = defineDataSourceAndDelegate();
    var dataSourceDelegate = new CollectionViewDataSourceAndDelegate();

    dataSourceDelegate.numberOfCells = function(collectionView, indexPath) {
        return colors.length;
    };

    dataSourceDelegate.cellForItem = function(collectionView, indexPath) {
        var cell = collectionView.dequeueReusableCellWithReuseIdentifierForIndexPath("Cell", indexPath);
        cell.backgroundColor = colors[indexPath.row];

        return cell;
    };

    dataSourceDelegate.didSelectItem = function(collectionView, indexPath) {
        var cell = collectionView.cellForItemAtIndexPath(indexPath);
        robot.setLEDColor(cell.backgroundColor);
    };

    for (var i = 0; i < 50; i++) {
        var hue = ((Math.random() * 4294967296) % 256 / 256.0);
        var saturation = ((Math.random() * 4294967296) % 128 / 256.0) + 0.5;
        var brightness = ((Math.random() * 4294967296) % 128 / 256.0) + 0.5;
        colors.push(UIColor.colorWithHueSaturationBrightnessAlpha(hue, saturation, brightness, 1));
    }

    var screenRect = UIScreen.mainScreen.bounds;
    screenRect = CGRectMake(0 , 0, UIScreen.mainScreen.bounds.size.width, UIScreen.mainScreen.bounds.size.height - 64);
    var cellWidth = screenRect.size.width / 3.0;

    var layout = new UICollectionViewFlowLayout()
    layout.sectionInset = UIEdgeInsetsMake(0, 0, 0, 0);
    layout.itemSize = CGSizeMake(cellWidth, cellWidth);
    layout.minimumLineSpacing = 0;
    layout.minimumInteritemSpacing = 0;

    collectionView = UICollectionView.alloc().initWithFrameCollectionViewLayout(screenRect, layout);
    collectionView.registerClassForCellWithReuseIdentifier('UICollectionViewCell', "Cell");
    collectionView.backgroundColor = UIColor.clearColor;
    collectionView.setDataSource(dataSourceDelegate);
    collectionView.setDelegate(dataSourceDelegate);

    return collectionView;
}

function defineDataSourceAndDelegate() {
    var del = Hyperloop.defineClass('CollectionViewDataSourceAndDelegate', 'NSObject', ['UICollectionViewDataSource', 'UICollectionViewDelegate', 'UICollectionViewDelegateFlowLayout']);

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

    del.addMethod({
        selector: 'collectionView:didSelectItemAtIndexPath:',
        instance: true,
        arguments: ['UICollectionView', 'NSIndexPath'],
        callback: function (collectionView, indexPath) {
            if (this.didSelectItem) {
                this.didSelectItem(collectionView, indexPath);
            }
        }
    });

    return del;
}
