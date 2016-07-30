let cx = null;


/* beziercurve */
cx = document.querySelector('canvas#beziercurveto').getContext('2d');
cx.beginPath();
cx.moveTo(10, 90);
// control1=(10, 10) control2=(90, 10) goal(50, 90)
cx.bezierCurveTo(10, 10, 90, 10, 50, 90);
cx.lineTo(90, 10);
cx.lineTo(10, 10);
cx.closePath();
cx.stroke();



/* arcto */
cx = document.querySelector('canvas#arcto').getContext('2d');
cx.beginPath();
cx.moveTo(10, 10);

// control1=(90, 10) goal=(90, 90) radius=20
cx.arcTo(90, 10, 90, 90, 20);
cx.moveTo(10, 10);
// control=(90, 10), goal=(90, 90) radius=80
cx.arcTo(90, 10, 90, 90, 80);
cx.lineTo(10, 10);
cx.stroke();

/* arcto circle */
cx = document.querySelector('canvas#arcto-circle').getContext('2d');
cx.beginPath();
// center=(50, 50) radius=40, angle=0 to 7
cx.arc(50, 50, 40, 0, 7);
// center=(150, 50) radius=40 angle=0 to 1/2 PI
cx.moveTo(150, 50)
cx.arc(150, 50, 40, 0, 2 * Math.PI);
cx.stroke();


/* A pie chart */
let results = [
    {
        name: 'Satisfied',
        count: 1043,
        color: 'lightblue'
    },
    {
        name: 'Neutral',
        count: 563,
        color: 'lightgreen'
    },
    {
        name: 'Unsatisfied',
        count: 510,
        color: 'pink'
    },
    {
        name: 'No comment',
        count: 175,
        color: 'silver'
    }
];
cx = document.querySelector('canvas#pie-chart').getContext('2d');
let total = results.reduce((sum, choice) => {
    return sum + choice.count;
}, 0);

// start the top
let currentAngle = -0.5 * Math.PI;
results.forEach(function(result) {
    let sliceAngle = (result.count / total) * 2 * Math.PI;
    cx.beginPath();
    // center=100, 100, radius=100
    // from current angle, clockwise by slice's angle
    cx.arc(100, 100, 100,
           currentAngle, currentAngle + sliceAngle);
    currentAngle += sliceAngle;
    cx.lineTo(100, 100);
    cx.fillStyle = result.color;
    cx.fill();
});


/* fill text  */
cx = document.querySelector('canvas#fill-text').getContext('2d');
cx.font = '28px Georgia';
cx.fillStyle = 'fuchsia';
cx.fillText('i can draw text, too!', 10, 50);


/* draw image*/
cx = document.querySelector('canvas#draw-image').getContext('2d');
let img = document.createElement('img');
img.src = "img/hat.png";
img.addEventListener('load', () => {
    for (let x = 10; x < 200; x += 30) {
        cx.drawImage(img, x, 10);
    }
});

/* draw sprite*/
cx = document.querySelector('canvas#draw-sprite').getContext('2d');
img = document.createElement('img');
img.src = 'img/player.png';
let spriteW = 24;
let spriteH = 30;
img.addEventListener('load', () => {
    let cycle = 0;
    setInterval(() => {
        cx.clearRect(0, 0, spriteW, spriteH);
        cx.drawImage(img,
                     // source rectangle
                     cycle * spriteW, 0, spriteW, spriteH,
                     // destination rectangle
                     0, 0, spriteW, spriteH
                    );
        cycle = (cycle + 1 ) % 8;
    }, 120);
});
