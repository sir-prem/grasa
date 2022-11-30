class SliderUI {

	constructor() {

		this.fill_hue;
		this.fill_saturation;
		this.fill_value;
		this.fill_alpha;
		this.stroke_hue;
		this.stroke_saturation;
		this.stroke_value;
		this.stroke_alpha;
		this.stroke_width;
		
		this.fill_hue_slider;
		this.fill_saturation_slider;
		this.fill_value_slider;
		this.fill_alpha_slider;
		this.stroke_hue_slider;
		this.stroke_saturation_slider;
		this.stroke_value_slider;
		this.stroke_alpha_slider;
		this.stroke_width_slider;
		
		this.slidersInit();
	}

	// function: set initial values for colour sliders
	slidersInit() {

		this.fill_hue = 0;
		this.fill_saturation = 50;
		this.fill_value = 50;
		this.fill_alpha = 80;
		
		this.stroke_hue = 100;
		this.stroke_saturation = 50;
		this.stroke_value = 50;
		this.stroke_alpha = 80;

		this.stroke_width = 5;
	}

	createFillSliders() {
		//draw sliders
		this.fill_hue_slider = 			createSlider(0, 360, this.fill_hue, 1);
		this.fill_saturation_slider = 	createSlider(0, 100, this.fill_saturation, 1);
		this.fill_value_slider = 		createSlider(0, 100, this.fill_value, 1);
		this.fill_alpha_slider =			createSlider(0, 100, this.fill_alpha, 1);
	}

	setFillSliderPositions(x, y, line_spacing) {
		this.fill_hue_slider.position(x, y);
		this.fill_saturation_slider.position(x, y + line_spacing);
		this.fill_value_slider.position(x, y + ( 2 * line_spacing ));
		this.fill_alpha_slider.position(x, y + ( 3 * line_spacing ));
	}

	setFillSliderStyles(width) {
		this.fill_hue_slider.style('width', width);
		this.fill_saturation_slider.style('width', width);
		this.fill_value_slider.style('width', width);
		this.fill_alpha_slider.style('width', width);
	}	

	createStrokeSliders() {
		this.stroke_hue_slider = 			createSlider(0, 360, this.stroke_hue, 1);
		this.stroke_saturation_slider = 	createSlider(0, 100, this.stroke_saturation, 1);
		this.stroke_value_slider = 			createSlider(0, 100, this.stroke_value, 1);
		this.stroke_alpha_slider =			createSlider(0, 100, this.stroke_alpha, 1);
		this.stroke_width_slider = 			createSlider(0, 25, this.stroke_width, 1);
	}

	setStrokeSliderPositions(x, y, line_spacing) { // width-165, 350, 20
		this.stroke_hue_slider.position( x, y );
		this.stroke_saturation_slider.position( x, y + line_spacing );
		this.stroke_value_slider.position( x, y + ( 2 * line_spacing ));
		this.stroke_alpha_slider.position( x, y + ( 3 * line_spacing ));
		this.stroke_width_slider.position( x, y + ( 4 * line_spacing ));
	}

	setStrokeSliderStyles(width) {  // width = '100px'
		this.stroke_hue_slider.style('width', width);
		this.stroke_saturation_slider.style('width', width);
		this.stroke_value_slider.style('width', width);
		this.stroke_alpha_slider.style('width', width);
		this.stroke_width_slider.style('width', width);
	}

	updateValues() {

		this.fill_hue = 		  	this.fill_hue_slider.value();
		this.fill_saturation = 		this.fill_saturation_slider.value();
		this.fill_value 		= 	this.fill_value_slider.value();
		this.fill_alpha		= 		this.fill_alpha_slider.value();
		
		this.stroke_hue = 			this.stroke_hue_slider.value();
		this.stroke_saturation = 	this.stroke_saturation_slider.value();
		this.stroke_value 		= 	this.stroke_value_slider.value();
		this.stroke_alpha		= 	this.stroke_alpha_slider.value();

		this.stroke_width = 		this.stroke_width_slider.value();
	}
}
