class ConsoleUI {

	constructor() {
		this.modeSelectionWindow;
		this.activeModeWindow;
		this.contextWindow;
		this.navUI = new NavUI();
	}

	draw(x, y, width, height) {
		this.drawConsoleWindow(x, y, width, height);
		this.drawModeSelectMenu(x+20, y+20);
		this.drawActiveMode(x+170, y+20);
		this.drawContextMenu(x+170, y+30);
	}

	drawConsoleWindow(x, y, width, height) {
		fill('black');
		stroke('ivory');
		strokeWeight(1);
		rect(x, y, width, height);
		line(x+150, y+10, x+150, y+height-10);
		line(x+155, y+30, x+355, y+30);
		noStroke();
	}

	drawModeSelectMenu(x, y) {
		fill('ivory');
		textSize(10);
		text(`Mode Selection:`, x, y);
		text(`'C' = CREATE mode`, x, y+20);
		text(`'S' = SCULPT mode`, x, y+40);
		text(`'I' = INTERSECT mode`, x, y+60);
		text(`'P' = PAINT mode`, x, y+80);
	}

	drawActiveMode(x, y) {
		fill('chartreuse');
		text(`You are in ${navUI.currentMode} mode`, x, y);
	}

	drawContextMenu(x, y) {
		fill('ivory');
		textSize(10);
		switch(navUI.currentMode) {
			case 'CREATE':
				text(`'n' = New Shape`, x, y+20);
				text(`'s' = Simple Shape`, x, y+40);
				text(`'c' = Complex Shape`, x, y+60);
				break;
			case 'CREATE newShape':
				text(`'s' = Start point`, x, y+20);
				text(`'l' = Add Line Segment`, x, y+40);
				text(`'q' = Add Quad Segment`, x, y+60);
				text(`'b' = Add Bezier Segment`, x, y+80);
				text(`'x' = Close Shape`, x, y+100);
				break;
		}
		fill('chartreuse');
		text(`You pressed: ${navUI.currentKeyPress}`, x, y+120);
		text(`Next action is: ${navUI.nextAction}`, x, y+140);
	}

}
