function IntersectCircleLine(xC,yC,r,p1,p2,q1,q2){
    //(xC,yC) =  center of circle;  r = radius of circle:  (x-xC)^2+(y-yC)^2 = r^2
    //P(p1,p2) and Q(q1,q2) points that define segmente line rPQ by P and Q:  rPQ = [(1-s)p1+sq1, (1-s)p2+sq2] (parametrized with parameter s)
    G  = p1 * p1 - 2 * p1 * q1 + p2 * p2 - 2 * p2 * q2 + q1 * q1 + q2 * q2
    K  =  -p1 * p1 * q2 * q2 + 2 * p1 * p1 * q2 * yC + p1 * p1 * r * r - p1 * p1 * yC * yC + 2 * p1 * p2 * q1 * q2 - 2 * p1 * p2 * q1 * yC - 2 * p1 * p2 * q2 * xC + 2 * p1 * p2 * xC * yC - 2 * p1 * q1 * q2 * yC - 2 * p1 * q1 * r * r + 2 * p1 * q1 * yC * yC + 2 * p1 * q2 * q2 * xC - 2 * p1 * q2 * xC * yC - p2 * p2 * q1 * q1 + 2 * p2 * p2 * q1 * xC + p2 * p2 * r * r - p2 * p2 * xC * xC + 2 * p2 * q1 * q1 * yC - 2 * p2 * q1 * q2 * xC - 2 * p2 * q1 * xC * yC - 2 * p2 * q2 * r * r + 2 * p2 * q2 * xC * xC + q1 * q1 * r * r - q1 * q1 * yC * yC + 2 * q1 * q2 * xC * yC + q2 * q2 * r * r - q2 * q2 * xC * xC
    L  = p1 * p1 - p1 * q1 - p1 * xC + p2 * p2 - p2 * q2 - p2 * yC + q1 * xC + q2 * yC
    s  = [(Math.sqrt(K)+L)/G, -(Math.sqrt(K)-L)/G]
    return s
}