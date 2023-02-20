class GPathStyle {

    constructor(fillHSLA, strokeHSLA, strokeWidth) {
		this.fillHSLA = fillHSLA;
		this.strokeHSLA = strokeHSLA;
		this.strokeWidth = strokeWidth;
    }

    set(gPathStyle) {
        this.fillHSLA = gPathStyle.fillHSLA;
        this.strokeHSLA = gPathStyle.strokeHSLA;
        this.strokeWidth = gPathStyle.strokeWidth;
    }

    static set(path, gPathStyle) {
        path = g.colorize(
            path, 
            g.hslColor( gPathStyle.fillHSLA.hue,
						gPathStyle.fillHSLA.saturation,
						gPathStyle.fillHSLA.value,
						gPathStyle.fillHSLA.alpha), 
            g.hslColor( gPathStyle.strokeHSLA.hue,
						gPathStyle.strokeHSLA.saturation,
						gPathStyle.strokeHSLA.value,
						gPathStyle.strokeHSLA.alpha), 
            gPathStyle.strokeWidth);
        return path;
    }
}
