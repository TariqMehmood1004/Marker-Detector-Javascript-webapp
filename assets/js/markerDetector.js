class MarkerDetector {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas2DContext = this.canvas.getContext("2d");
        this.threshold = document.createElement("input");
        this.threshold.type = "range";
        this.threshold.min = 0;
        this.threshold.max = 255;
        this.threshold.value = 50;

        // document.body.append(this.canvas);
        // document.body.append(this.threshold);
    }

    #averagePoints(points) {
        let center = { x: 0, y: 0 };
        for (let point of points) {
            center.x += point.x;
            center.y += point.y;
        }

        center.x /= points.length;
        center.y /= points.length;
        return center;
    }

    detect(getImageData) {

        let points = [];
        // debugger;

        for (let i = 0; i < getImageData.data.length; i += 4) {
            const r = getImageData.data[i + 0];
            const g = getImageData.data[i + 1];
            const b = getImageData.data[i + 2];

            let blueness = b - Math.max(r, g)
            if (blueness > this.threshold.value) {
                let pIndex = i / 4;
                let x = pIndex % getImageData.width;
                let y = Math.floor(pIndex / getImageData.width);
                points.push({ x, y, blueness });

            }

        }

        let centeroid = points[0];
        let centeroid2 = points[points.length - 1];

        let group1 = [];
        let group2 = [];

        for (let i = 1; i <= 10; i++) {
            group1 = points.filter(
                (p) => distance(p, centeroid) < distance(p, centeroid2)
            );

            group2 = points.filter(
                (p) => distance(p, centeroid) >= distance(p, centeroid2)
            );

            centeroid = this.#averagePoints(group1);
            centeroid2 = this.#averagePoints(group2);
        }

        // for group1
        let size = Math.sqrt(group1.length);
        let radius = size / 2;

        // for group2
        let size2 = Math.sqrt(group2.length);
        let radius2 = size2 / 2;


        // this.canvas.width = getImageData.width;
        // this.canvas.height = getImageData.height + 255;

        // this.canvas2DContext.fillStyle = "red";
        // for (let point of group1) {
        //     this.canvas2DContext.globalAlpha = point.blueness / 255;
        //     this.canvas2DContext.fillRect(point.x, point.y, 1, 1);
        // }

        // this.canvas2DContext.fillStyle = "yellow";
        // for (let point of group2) {
        //     this.canvas2DContext.globalAlpha = point.blueness / 255;
        //     this.canvas2DContext.fillRect(point.x, point.y, 1, 1);
        // }

        // this.canvas2DContext.globalAlpha = 1;

        // // for group1
        // this.canvas2DContext.beginPath();
        // this.canvas2DContext.arc(centeroid.x, centeroid.y, radius, 0, Math.PI * 2);
        // this.canvas2DContext.stroke();

        // // for group1
        // this.canvas2DContext.beginPath();
        // this.canvas2DContext.arc(centeroid2.x, centeroid2.y, radius2, 0, Math.PI * 2);
        // this.canvas2DContext.stroke();

        // this.canvas2DContext.translate(0, getImageData.height);

        // points.sort((a, b) => b.blueness - a.blueness);

        // for (let i = 0; i < points.length; i++) {
        //     let y = points[i].blueness;
        //     let x = this.canvas.width * i / points.length;
        //     this.canvas2DContext.fillRect(x, y, 1, 1)
        // }


        let marker1 = {
            centeroid: centeroid,
            points: group1,
            radius: radius
        };

        let marker2 = {
            centeroid: centeroid2,
            points: group2,
            radius: radius2
        };

        return {
            leftMarker: centeroid.x < centeroid2.x ? marker1 : marker2,
            rightMarker: centeroid.x < centeroid2.x ? marker2 : marker2,
        };
    }
};