(function(lib, cjs) {
    lib.DashLine = function(points, dashWidth, dashGap) {
        if(points[0] && points[1] && points[2] && points[3]) {
            var a = new cjs.Point(0, 0);
            var b = new cjs.Point(points[1].x-points[0].x, points[1].y-points[0].y);
            var c = new cjs.Point(points[2].x-points[0].x, points[2].y-points[0].y);
            var d = new cjs.Point(points[3].x-points[0].x, points[3].y-points[0].y);
            var angle = getAngle(a, d);
            b = whirlPoint(b, angle);
            c = whirlPoint(c, angle);
            d = whirlPoint(d, angle);
            var bPoints = getBezierPoints(new lib.BezierSegment(a, b, c, d), dashWidth, dashGap);
            var tPoints;
            for(var i = 0; i < bPoints.length/2; i++) {
                tPoints = new cjs.Point(bPoints[i*2], bPoints[i*2+1]);
                tPoints = whirlPoint(tPoints, -angle);
                bPoints[i*2] = tPoints.x + points[0].x;
                bPoints[i*2+1] = tPoints.y + points[0].y;
            }
            return bPoints;
        }
        return null;
    }

    function getBezierPoints(bezierSegment, dashWidth, dashGap) {
        if(bezierSegment.d.x < bezierSegment.a.x) {
            dashWidth = -dashWidth;
            dashGap = -dashGap;
        }
        var startP = new cjs.Point(bezierSegment.a.x, bezierSegment.a.y);
        var endP = new cjs.Point(0, 0);
        var endX, endXH;
        var np = []; 
        np.push(startP.x, startP.y);
        var i = 0;
        var dis, disL;
        while((i % 2 == 0 && Math.abs(startP.x - bezierSegment.d.x) >= Math.abs(dashWidth)) || (i % 2 == 1 && Math.abs(startP.x + bezierSegment.d.x) >= Math.abs(dashWidth))) {
            disL = (i % 2 == 0) ? dashWidth : dashGap;
            endP.x = startP.x + disL;
            endP.y = bezierSegment.getYForX(endP.x);
            endXH = startP.x;
            while(1) {
                dis = getPointsDistance(startP, endP) - Math.abs(disL);
                if(Math.abs(dis) <= 0.1) {
                    np.push(endP.x, endP.y);
                    startP.x = endP.x;
                    startP.y = endP.y;
                    break;
                } else {
                    if(dis > 0.1) {
                        endX = endP.x;
                        endP.x = 0.5 * (endP.x + endXH);
                    } else if(dis < -0.1) {
                        endXH = endP.x;
                        endP.x = 0.5 * (endP.x + endX);
                    }
                    endP.y = bezierSegment.getYForX(endP.x);
                }
            }
            i++;
        }
        return np;
    }

    function getAngle(start, end) {
        return Math.atan((end.y-start.y)/(end.x-start.x));
    }

    function whirlPoint(point, angle) {
        var x = point.x*Math.cos(angle) + point.y*Math.sin(angle);
        var y = -point.x*Math.sin(angle) + point.y*Math.cos(angle);
        return new cjs.Point(x, y);
    }

    function getPointsDistance(a, b) {
        return  Math.sqrt(Math.pow((b.x-a.x), 2) + Math.pow((b.y-a.y), 2));
    }
})(lib=lib||{},createjs=createjs||{});
var lib,createjs;
