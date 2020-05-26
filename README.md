# PP Movable Scene

This is good solution if you want create movable scene by mouse move.

Demo where you see nice used this plugin: https://perfectlyproject.pl

## Installation:

```
npm i pp-movable-scene --save-dev
```

## Usage:
```
import PPMovableScene from 'pp-movable-scene';
new PPMovableScene({
        selector: '#scene',
        animate: true,
        shapes: {
            1200: [
                {
                    type: 'example-shape-1',
                    left: 10,
                    top: 30,
                    ratio: 0.7,
                    speed: 900,
                    direction: 'invert'
                },
                {
                    type: 'example-shape-2',
                    left: 40,
                    top: 70,
                    ratio: 0.04,
                    speed: 500,
                }
            ],
            0: [
                {
                    type: 'example-shape-2',
                    left: 10,
                    top: 70,
                    ratio: 0.04,
                    speed: 500,
                }
            ]
        }
    });
```

## Options:

| Option | Description | Type |
| - |-| - |
| selector | Selector where will be create scene | string |
| animate | Random animate for item | boolean |
| shapes | List shapes in this place we have to define breakpoint which is used to upwards. For example it's working like media query min-width in css | array |

### Options for shape object:
| Option | Description | Type |
| - |-| - |
| type | Is param which setup class for element | string |
| top/left |  Started top/left position in percent | integer |
| ratio | Ratio is used to set how long shift will be when we mouse move in any direction | float |
| speed | Setup speed transition in milliseconds | integer |
| direction | Setup direction, can be setup normal or invert, default is setup normal | integer |

### Methods:
| Method | Description |
| - | - |
| .stop() | use when you want stop animation and effect for mousemove |
| .run() | use when you used earlier .stop() and you want run again effect |