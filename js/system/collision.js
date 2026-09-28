export class Collision {
    
    static ballWithWall(ball, width, height) {

        //Top wall
        if (ball.y + ball.radius <= 0) {
            ball.y = ball.radius;
            ball.vy *= -1;
        }

        //Right wall
        if (ball.x + ball.radius >= width) {
            ball.x = width - ball.radius;
            ball.vx *= -1;
        }

        //Left wall
        if (ball.x + ball.radius <= 0) {
            ball.x = ball.radius;
            ball.vx *= -1;
        }
    }
}