export default (app) => {
  app.directive('dragwidth', {
    mounted (el, binding, vnode) {
      let odiv = el;
      let x = 0;
      let y = 0;
      let isDown = false;

      odiv.onmousedown = function (e) {
        if (e.button === 0) {
          //获取x坐标和y坐标
          x = e.clientX;
          y = e.clientY;
          let rect = odiv.getBoundingClientRect();

          isDown = true;

          document.onmousemove = function (e) {
            if (isDown) {
              let nx = e.clientX;
              let ny = e.clientY;

              odiv.style.transform = `translate(${nx - (x - rect.x)
                }px, ${ny - (y - rect.y)}px)`;
            }
          }

          document.onmouseup = function () {
            isDown = false;

            document.onmousemove = null;
            document.onmouseup = null;
          }
        }
      }
    },
  })
}