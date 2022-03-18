let engine = Matter.Engine.create();

      let render = Matter.Render.create({
          element: document.body,
          engine: engine,
          options: {
            width: 1600,
            height: 800, 
            wireframes: false,
        }
      });
      
      let ground = Matter.Bodies.rectangle(0, 700, 2400, 33, {isStatic: true});
      let car = Matter.Composites.car(0, 0, 50, 60, 38);
      
      let ball = Matter.Bodies.circle(300, 600,20);
      let sling = Matter.Constraint.create({ 
            pointA: { x: 300, y: 600 }, 
            bodyB: ball, 
            stiffness: 0.05,
            fillStyle: 'red',
        });
      
      let mouse = Matter.Mouse.create(render.canvas);
      let mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                render: {visible: false}
            }
        });
      render.mouse = mouse;
      
      let firing = false;
      Matter.Events.on(mouseConstraint,'enddrag', function(e) {
        if(e.body === ball) firing = true;
      });
      Matter.Events.on(engine,'afterUpdate', function() {
        if (firing && Math.abs(ball.position.x-300) < 20 && Math.abs(ball.position.y-600) < 20) {
            ball = Matter.Bodies.circle(300, 600, 20);
            Matter.World.add(engine.world, ball);
            sling.bodyB = ball;
            firing = false;
        }
      });

      Matter.World.add(engine.world, [ground, ball, sling, mouseConstraint, car]);
      Matter.Engine.run(engine);
      Matter.Render.run(render);
