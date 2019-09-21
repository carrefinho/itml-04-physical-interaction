let sentiment;
let title, input, score, speed, distance, overall;
let capture, ctracker;

let currentText, textDifference, speedScore;
let previousText = '';

let sentimentBase, speedFactor, distanceFactor, overallScore = 0;

function setup() {
    createCanvas(1280, 960);

    capture = createCapture(VIDEO);
    capture.size(1280, 960);
    capture.hide();

    ctracker = new clm.tracker();
    ctracker.init();
    ctracker.start(capture.elt);

    title = select('#title');
    input = select('#input');
    score = select('#sentiment');
    speed = select('#speed');
    distance = select('#distance');
    overall = select('#overall');

    // prep model
    sentiment = ml5.sentiment('movieReviews', () => {
        console.log('model ready');
        title.html('sentiment analysis');
    })

    // basic sentiment analysis every time there's new input
    $('#input').on('input', () => {
        console.log('value changed');
        let prediction = sentiment.predict(input.value());
        sentimentBase = map(prediction.score, 0, 1, -1, 1);
        score.html(sentimentBase);
    })

    setInterval(function(){
        // Get current text of input
        currentText = input.value();
    
        // Calculate difference in text lengths from last reading
        textDifference = currentText.length - previousText.length;
        speedFactor = constrain(map(textDifference, 0, 12, 1, 1.25), 1, 1.25);
        previousText = currentText;

        speed.html(speedFactor);
    }, 1000);
    
}

function draw() {
    // get tracking points
    let positions = ctracker.getCurrentPosition();

    // if there is data
    if (positions != false) {
        // calculate distance between two eyes
        let dx = positions[23][0] - positions[28][0];
        let dy = positions[23][1] - positions[28][1];
        eyeDistance = Math.sqrt( dx * dx + dy * dy );

        // map that from 1 to 1.25
        distanceFactor = constrain(map(eyeDistance, 130, 250, 1, 1.25), 1, 1.25);
        distance.html(distanceFactor);
    }

    // calculate overall score
    if (sentimentBase != NaN && speedFactor != NaN && distanceFactor != NaN) {
        overallScore = constrain(map(sentimentBase * speedFactor * distanceFactor, -1.5, 1.5, -1, 1), -1, 1);
        overall.html(overallScore);
    }
}

