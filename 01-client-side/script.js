let sentiment;
let title, input, submit;

function setup() {
    noCanvas();
    title = select('#title');
    input = select('#input');
    submit = select('#submit');

    sentiment = ml5.sentiment('movieReviews', () => {
        console.log('model ready');
        title.html('sentiment analysis');
    })

    submit.mousePressed(() => {
        let prediction = sentiment.predict(input.value());
        console.log(prediction.score);
    })
}