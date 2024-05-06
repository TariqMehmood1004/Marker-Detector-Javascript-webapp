let distance = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

document.addEventListener("DOMContentLoaded", () => {
    let canvas2DContext = myCanvasDetector.getContext("2d");
    let myVideoDetector = document.createElement("video");
    let markerDetector = new MarkerDetector();

    canvas2DContextLoop = () => {
        canvas2DContext.drawImage(myVideoDetector, 0, 0, myCanvasDetector.width, myCanvasDetector.height);
        let getImageData = canvas2DContext.getImageData(0, 0, myCanvasDetector.width, myCanvasDetector.height);
        let result = markerDetector.detect(getImageData);
        if (result) {
            canvas2DContext.fillStyle = "red";
            for (let point of result.leftMarker.points) {
                canvas2DContext.fillRect(point.x, point.y, 1, 1);
            }

            canvas2DContext.fillStyle = "yellow";
            for (let point of result.rightMarker.points) {
                canvas2DContext.fillRect(point.x, point.y, 1, 1);
            }
        }
        // debugger;

        requestAnimationFrame(canvas2DContextLoop);
    }

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((data) => {
            myVideoDetector.srcObject = data;
            myVideoDetector.play();

            myVideoDetector.onloadeddata = () => {
                myCanvasDetector.width = myVideoDetector.videoWidth;
                myCanvasDetector.height = myVideoDetector.videoHeight;

                canvas2DContextLoop();




            }
        })
        .catch((err) => console.log(`Error: ${err}`))
});