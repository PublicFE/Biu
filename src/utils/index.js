function onWindowResize(camera,renderer) {

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate({clock,mixer,scene,camera,renderer,stats}) {

    requestAnimationFrame(()=>animate({clock,mixer,scene,camera,renderer,stats}));

    const delta = clock.getDelta();

    if (mixer) mixer.update(delta);

    renderer.render(scene, camera);

    stats.update();

}

export {
    onWindowResize,
    animate
}
