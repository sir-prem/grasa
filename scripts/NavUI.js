class NavUI {

	constructor() {
		this.currentMode = 'UNKNOWN';
		this.nextAction = 'unknown';
		this.currentKeyPress = 'U';
	}

	printData() {
		console.log(`-------------------------------`);
		console.log(`NAV-UI parameters:`);
		console.log(`mode:    		${this.currentMode}`);
		console.log(`nextAction:	${this.nextAction}`);
		console.log(`keyPress:		${this.currentKeyPress}`);
		console.log(`-------------------------------`);
	}

	processKeyPress(key) {
		this.currentKeyPress = key;
		this.setMode(key);
		this.setNextAction(key);
		this.printData();
	}

	setMode(key) {
		switch(key) {
			case 'C':
				this.currentMode = 'CREATE';	break;
			case 'S':
				this.currentMode = 'SCULPT';	break;
			case 'I':
				this.currentMode = 'INTERSECT';	break;
			case 'P':
				this.currentMode = 'PAINT'; 	break;
		}
	}

	setNextAction(key) {
		switch(this.currentMode) {
			case 'CREATE':
				switch (key) {
					case 'n':
						this.currentMode = 'CREATE newShape'; break;
					case 's':
						this.currentMode = 'CREATE simpleShape';  break;
					case 'c':
						this.currentMode = 'CREATE complexShape';  break;
				}  break;
			case 'CREATE newShape':
				switch (key) {
					case 's':
						this.nextAction = 'startPoint';  break;
					case 'l':
						this.nextAction = 'addLine';	break;
					case 'b':
						this.nextAction = 'addBezier';	break;
					case 'q':
						this.nextAction = 'addQuad';	break;
					case 'x':
						this.nextAction = 'closeShape';	break;

				}  break;
			case 'INTERSECT':
				switch (key) {
					case 'f':
						this.nextAction = 'firstShape';   break;
					case 'n':
						this.nextAction = 'nextShape';    break;
				}  break;
		}

	}

	static drawHeader(width, height, sliderUI, key, mode, nextAction) {
		//draw mouse co-ords
		fill('indianred');
		textSize(14);
		text(`(${Math.trunc(mouseX)},${Math.trunc(mouseY)})`, mouseX+10, mouseY+20);
		
		// draw header/logo
		fill('ivory');
		textSize(18);
		text(`GRASA v1.0`, width-250, 30);
		textSize(10);
		text(`An abstract shape`, width-250, 45);
		text(`ideation tool`, width-250, 55);

		// draw mode and next action
		//fill('lightseagreen');
		textSize(11);

		text(`FILL`, width-250, 165);
		text(`Hue`, width-250, 185);
		text(`Saturation`, width-250, 205);
		text(`Lightness`, width-250, 225);
		text(`Opacity`, width-250, 245);
		
		text(`STROKE`, width-250, 295);
		text(`Hue`, width-250, 315);
		text(`Saturation`, width-250, 335);
		text(`Lightness`, width-250, 355);
		text(`Opacity`, width-250, 375);
		text('Width', width-250, 395);

		let fill_alpha_decimal = sliderUI.fill_alpha/100;

		let fill_colour = color(`hsla(${sliderUI.fill_hue}, 
					${sliderUI.fill_saturation}%, 
					${sliderUI.fill_value}%, 
					${fill_alpha_decimal})`);

		let stroke_alpha_decimal = sliderUI.stroke_alpha/100;

		let stroke_colour = color(`hsla(${sliderUI.stroke_hue}, 
					${sliderUI.stroke_saturation}%, 
					${sliderUI.stroke_value}%, 
					${stroke_alpha_decimal})`);

		fill(fill_colour);
		stroke(stroke_colour);
		strokeWeight(sliderUI.stroke_width);
		
		rect(width-120, 100, 45, 45); // Draw rectangle
		noStroke();
	}
}
