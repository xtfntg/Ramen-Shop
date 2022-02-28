import Experience from '../Experience.js'
import RamenShop from './RamenShop.js'
import gsap from 'gsap'


export default class Animations
{
    constructor()
    {
        this.experience = new Experience()
        this.scene = this.experience.scene
        this.resources = this.experience.resources
        this.time = this.experience.time
        this.loaded = 0

        //Set up tick function
        this.update = function update() {}

        // Wait for resources
        this.resources.on('ready', async () =>
        {
            // Setup
            this.ramenShop = this.experience.world.ramenShop
            this.hologram = this.experience.world.hologram
            this.controller = this.experience.controller
            this.materials = this.experience.materials

            // Update Function
            this.enableUpdate()
            
            this.photoCounter = 0

            this.sideScreen = 1

            this.materials.sideScreenMaterial.uniforms.texture2.value = this.resources.items.sideScreen2Texture
        })
    }

    enableUpdate()
    {
        this.update = function update() {
            {this.ramenShop.fan1.rotation.y = -this.time.elapsed * 3 * 0.001}
            {this.ramenShop.fan2.rotation.y = -this.time.elapsed * 3 * 0.001}
            {this.ramenShop.dish.rotation.y = Math.sin(this.time.elapsed * 0.5 * 0.001) *.4 - Math.PI *.2}
            {this.hologram.mesh.rotation.y += - 0.25 * this.time.delta * 0.001}
            {
                this.photoCounter += 1
                if(this.photoCounter > 300)
                {
                    this.controller.videoControls.smallScreen1()
                    this.controller.videoControls.smallScreen2()
                }
            }
            {
                if(this.materials.sideScreenMaterial.uniforms.progress.value >= 1)
                {
                    this.changeSideScreen()
                    
                }
                else{
                    this.materials.sideScreenMaterial.uniforms.progress.value += 0.002
                    console.log(this.materials.sideScreenMaterial.uniforms.progress.value)
                    
                }
            }
        }
    }

    changeSideScreen()
    {
        switch(this.sideScreen) {
            case 1:
                this.materials.sideScreenMaterial.uniforms.texture1 = this.resources.items.sideScreen2Texture
                this.materials.sideScreenMaterial.uniforms.texture2 = this.resources.items.sideScreen3Texture
    
                
                this.materials.sideScreenMaterial.uniforms.progress.value = 0
                
                this.sideScreen +=1
                console.log(this.sideScreen)
                break
            case 2:

                this.materials.sideScreenMaterial.uniforms.texture1 = this.resources.items.sideScreen1Texture
                
                this.materials.sideScreenMaterial.uniforms.progress.value = 0
                this.sideScreen +=1
                console.log(this.sideScreen)
                break
            case 3:
                this.materials.sideScreenMaterial.uniforms.texture1 = this.resources.items.sideScreen1Texture

                
                this.materials.sideScreenMaterial.uniforms.progress.value = 0
                this.sideScreen = 1
                console.log(this.sideScreen)
                break
        }
    }

    slideTransition(material,newTexture, duration)
    {
        material.uniforms.texture2.value = newTexture
        gsap.to(material.uniforms.progress, {value:1,
            duration: duration,
            ease: "linear",
            onComplete: () => {
                material.uniforms.texture1.value = newTexture
                material.uniforms.progress.value = 0
            }
        })
    }

    sleep(ms) 
    {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}