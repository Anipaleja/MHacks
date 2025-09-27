export class SpringAnimate {
  // Spring constant
  k: number
  // Damping constant
  damp: number
  // Mass of the object
  mass: number

  velocity: vec3

  constructor(k: number, damp: number, mass: number) {
    this.k = k
    this.damp = damp
    this.mass = mass
    this.velocity = vec3.zero()
  }

  /**
   * Evaluates the new position of the object based on the spring dynamics.
   * @param currentValue The current position of the object.
   * @param targetValue The target position of the object.
   * @returns The updated position of the object.
   */
  public evaluate(currentValue: vec3, targetValue: vec3): vec3 {
    // Calculate the spring force for each axis
    const forceX = -this.k * (currentValue.x - targetValue.x)
    const forceY = -this.k * (currentValue.y - targetValue.y)
    const forceZ = -this.k * (currentValue.z - targetValue.z)
    const force = new vec3(forceX, forceY, forceZ)

    // Damping for each axis
    const damping = this.velocity.uniformScale(-this.damp)

    // Acceleration
    const acceleration = force.add(damping).uniformScale(1 / this.mass)

    // Update velocity
    this.velocity = this.velocity.add(acceleration.uniformScale(getDeltaTime()))

    // Update position
    const updatedValue = currentValue.add(this.velocity.uniformScale(getDeltaTime()))

    return updatedValue
  }

  /**
   * Creates a new spring animation with the given duration and bounce.
   * @param duration - The perceptual duration of the animation in seconds.
   * @param bounce - How much bounce the spring should have. 0 is no bounce, 1 is infinite bounce.
   * @returns A new spring animation object.
   */
  public static spring(duration: number, bounce: number): SpringAnimate {
    const k = Math.pow((2 * Math.PI) / duration, 2)
    const damp = ((1 - bounce) * (4 * Math.PI)) / duration
    return new SpringAnimate(k, damp, 1)
  }

  public static smooth(duration = 0.3): SpringAnimate {
    return SpringAnimate.spring(duration, 0)
  }

  public static snappy(duration = 0.3): SpringAnimate {
    return SpringAnimate.spring(duration, 0.15)
  }

  public static bouncy(duration = 0.5): SpringAnimate {
    return SpringAnimate.spring(duration, 0.3)
  }

  public reset(): void {
    this.velocity = vec3.zero()
  }
}
