 var slider = document.getElementById('slider');

 noUiSlider.create(slider, {
     start: [18, 60],
     connect: true,
     tooltips: true,
     format: wNumb({
         decimals: 0
     }),
     range: {
         'min': 18,
         'max': 60
     }
 });
 var ageMin = document.getElementById('age-min');
 var ageMax = document.getElementById('age-max');

 slider.noUiSlider.on('update', function(values, handle) {

     var value = values[handle];

     if (handle) {
         ageMax.value = value;
     } else {
         ageMin.value = value;
     }
 });
 var actualMin = ageMin.getAttribute("value");
 slider.noUiSlider.set([actualMin, null]);
 var actualMax = ageMax.getAttribute("value");
 slider.noUiSlider.set([null, actualMax]);

 ageMin.addEventListener('change', function() {
     slider.noUiSlider.set([this.value, null]);
 });
 ageMax.addEventListener('change', function() {
     slider.noUiSlider.set([null, this.value]);
 });