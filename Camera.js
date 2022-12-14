class Camera {

    constructor() {

        this.eye = new Vector3([0,0,3]);
        this.at = new Vector3([0,0,-100]);
        this.up = new Vector3([0,1,0]);
    }

    forward() {

        var w = new Vector3;
        w.set(this.at);
        w.sub(this.eye);
        w.normalize();
        this.at.add(w);
        this.eye.add(w);
    }

    backward() {

        var s = new Vector3;
        s.set(this.eye);
        s.sub(this.at);
        s.normalize();
        this.at.add(s);
        this.eye.add(s);
    }

    left() {

        var a = new Vector3;
        a.set(this.at);
        a.sub(this.eye);
        a.normalize();
        var c = Vector3.cross(this.up, a);
        this.at.add(a);
        this.eye.add(a);
    }

    right() {

        var d = new Vector3;
        d.set(this.eye);
        d.sub(this.at);
        d.normalize();
        var c = Vector3.cross(this.up, d);
        this.at.add(d);
        this.eye.add(d);
    }

    turnLeft() {

        var turnL = new Vector3;
        turnL.set(this.at);
        turnL.sub(this.eye);
        let rotateMat = new Matrix4();
        rotateMat.setIdentity();
        rotateMat.setRotate(1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let d3D = rotateMat.multiplyVector3(turnL);
        this.at = d3D.add(this.eye);
    }

    turnRight() {

        var turnR = new Vector3;
        turnR.set(this.at);
        turnR.sub(this.eye);
        let rotateMat = new Matrix4();
        rotateMat.setIdentity();
        rotateMat.setRotate(-1, this.up.elements[0], this.up.elements[1], this.up.elements[2]);
        let d3D = rotateMat.multiplyVector3(turnR);
        this.at = d3D.add(this.eye);
    }
}
