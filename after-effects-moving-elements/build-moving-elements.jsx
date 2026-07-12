// ============================================================
//  Moving Elements Project Builder for Adobe After Effects
// ------------------------------------------------------------
//  HOW TO RUN (inside After Effects):
//    File > Scripts > Run Script File...  -> pick this .jsx file
//
//  WHAT IT BUILDS:
//    01 - Master Comps : 3 ready comps (16:9, 1:1, 9:16)
//    02 - Elements     : 10 reusable animated shape elements
//                        (circles, squares, triangle, hexagon,
//                         star, ring, bar, cross, dots)
//
//  All animations are expression-driven and loop seamlessly
//  over the 10 second comp duration.
// ============================================================

(function buildMovingElementsProject() {

    app.beginUndoGroup("Build Moving Elements Project");

    // ------------------------- settings -------------------------
    var FPS = 30;
    var DUR = 10;          // seconds - keep frequencies loop-friendly
    var TWO_PI = "Math.PI*2";

    var COLORS = {
        blue:   [0.20, 0.47, 0.96],
        teal:   [0.10, 0.74, 0.61],
        orange: [1.00, 0.60, 0.20],
        pink:   [0.93, 0.28, 0.60],
        yellow: [1.00, 0.80, 0.25],
        purple: [0.55, 0.36, 0.96],
        white:  [0.95, 0.96, 1.00],
        dark:   [0.06, 0.08, 0.14]
    };

    var proj = app.project;
    var masterFolder   = proj.items.addFolder("01 - Master Comps");
    var elementsFolder = proj.items.addFolder("02 - Elements");

    // ------------------------- helpers --------------------------

    // Adds one shape group (path + fill/stroke) to a shape layer.
    // spec: { shape:'ellipse'|'rect'|'poly'|'star',
    //         size:[w,h], points, outerRadius, innerRadius,
    //         roundness, fill:[r,g,b], fillOpacity,
    //         strokeColor:[r,g,b], strokeWidth,
    //         groupPosition:[x,y], groupRotation }
    function addShapeGroup(layer, spec) {
        var contents = layer.property("ADBE Root Vectors Group");
        var group = contents.addProperty("ADBE Vector Group");
        var gc = group.property("ADBE Vectors Group");

        if (spec.shape === "ellipse") {
            var el = gc.addProperty("ADBE Vector Shape - Ellipse");
            el.property("ADBE Vector Ellipse Size").setValue(spec.size);
        } else if (spec.shape === "rect") {
            var rc = gc.addProperty("ADBE Vector Shape - Rect");
            rc.property("ADBE Vector Rect Size").setValue(spec.size);
            if (spec.roundness) {
                rc.property("ADBE Vector Rect Roundness").setValue(spec.roundness);
            }
        } else if (spec.shape === "poly" || spec.shape === "star") {
            var st = gc.addProperty("ADBE Vector Shape - Star");
            st.property("ADBE Vector Star Type").setValue(spec.shape === "star" ? 1 : 2);
            st.property("ADBE Vector Star Points").setValue(spec.points);
            st.property("ADBE Vector Star Outer Radius").setValue(spec.outerRadius);
            if (spec.shape === "star") {
                st.property("ADBE Vector Star Inner Radius").setValue(spec.innerRadius);
            }
        }

        if (spec.fill) {
            var fill = gc.addProperty("ADBE Vector Graphic - Fill");
            fill.property("ADBE Vector Fill Color").setValue([spec.fill[0], spec.fill[1], spec.fill[2], 1]);
            if (spec.fillOpacity !== undefined) {
                fill.property("ADBE Vector Fill Opacity").setValue(spec.fillOpacity);
            }
        }
        if (spec.strokeColor) {
            var stroke = gc.addProperty("ADBE Vector Graphic - Stroke");
            stroke.property("ADBE Vector Stroke Color").setValue([spec.strokeColor[0], spec.strokeColor[1], spec.strokeColor[2], 1]);
            stroke.property("ADBE Vector Stroke Width").setValue(spec.strokeWidth || 8);
        }

        var gt = group.property("ADBE Vector Transform Group");
        if (spec.groupPosition) gt.property("ADBE Vector Position").setValue(spec.groupPosition);
        if (spec.groupRotation) gt.property("ADBE Vector Rotation").setValue(spec.groupRotation);

        return group;
    }

    function transformOf(layer) {
        return layer.property("ADBE Transform Group");
    }

    // Loop-friendly expression presets (frequencies * DUR = integer)
    function applyAnim(layer, anim) {
        var t = transformOf(layer);
        if (anim === "spin")       t.property("ADBE Rotate Z").expression = "time * 36";
        if (anim === "spinFast")   t.property("ADBE Rotate Z").expression = "time * 72";
        if (anim === "spinBack")   t.property("ADBE Rotate Z").expression = "time * -36";
        if (anim === "pulse")      t.property("ADBE Scale").expression =
            "amp = 12; freq = 0.3;\n" +
            "s = Math.sin(time*" + TWO_PI + "*freq)*amp;\n" +
            "[value[0]+s, value[1]+s]";
        if (anim === "float")      t.property("ADBE Position").expression =
            "ax = 25; ay = 45; fx = 0.2; fy = 0.3;\n" +
            "value + [Math.sin(time*" + TWO_PI + "*fx)*ax, Math.cos(time*" + TWO_PI + "*fy)*ay]";
        if (anim === "sway")       t.property("ADBE Position").expression =
            "ax = 60; fx = 0.1;\n" +
            "value + [Math.sin(time*" + TWO_PI + "*fx)*ax, 0]";
        if (anim === "breatheOpacity") t.property("ADBE Opacity").expression =
            "70 + Math.sin(time*" + TWO_PI + "*0.5)*30";
    }

    // Creates a transparent element comp with a single animated shape layer.
    function makeElementComp(name, w, h, groups, anims) {
        var comp = proj.items.addComp(name, w, h, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;

        var layer = comp.layers.addShape();
        layer.name = name;
        transformOf(layer).property("ADBE Position").setValue([w / 2, h / 2]);

        var i;
        for (i = 0; i < groups.length; i++) addShapeGroup(layer, groups[i]);
        for (i = 0; i < anims.length; i++) applyAnim(layer, anims[i]);

        return comp;
    }

    // ------------------------- elements -------------------------
    var elements = {};

    elements.circleSmall = makeElementComp("Circle_Small_Pulse", 400, 400,
        [{ shape: "ellipse", size: [180, 180], fill: COLORS.orange }],
        ["pulse", "float"]);

    elements.circleBig = makeElementComp("Circle_Big_Float", 600, 600,
        [{ shape: "ellipse", size: [340, 340], fill: COLORS.blue }],
        ["float"]);

    elements.ring = makeElementComp("Ring_Pulse", 500, 500,
        [{ shape: "ellipse", size: [280, 280], strokeColor: COLORS.teal, strokeWidth: 24 }],
        ["pulse", "breatheOpacity"]);

    elements.squareSmall = makeElementComp("Square_Small_Spin", 400, 400,
        [{ shape: "rect", size: [150, 150], roundness: 16, fill: COLORS.pink }],
        ["spin", "float"]);

    elements.squareBig = makeElementComp("Square_Big_Rounded_Float", 600, 600,
        [{ shape: "rect", size: [300, 300], roundness: 60, fill: COLORS.purple }],
        ["float", "spinBack"]);

    elements.triangle = makeElementComp("Triangle_Spin", 500, 500,
        [{ shape: "poly", points: 3, outerRadius: 150, fill: COLORS.yellow }],
        ["spin", "float"]);

    elements.hexagon = makeElementComp("Hexagon_Rotate", 600, 600,
        [{ shape: "poly", points: 6, outerRadius: 200, strokeColor: COLORS.blue, strokeWidth: 18 }],
        ["spinBack", "pulse"]);

    elements.star = makeElementComp("Star_Twinkle", 500, 500,
        [{ shape: "star", points: 5, outerRadius: 160, innerRadius: 75, fill: COLORS.yellow }],
        ["spin", "pulse", "breatheOpacity"]);

    elements.bar = makeElementComp("Bar_Sway", 700, 300,
        [{ shape: "rect", size: [420, 70], roundness: 35, fill: COLORS.teal }],
        ["sway"]);

    elements.cross = makeElementComp("Cross_Spin", 450, 450,
        [
            { shape: "rect", size: [240, 70], roundness: 35, fill: COLORS.white },
            { shape: "rect", size: [70, 240], roundness: 35, fill: COLORS.white }
        ],
        ["spinFast", "float"]);

    // Three bouncing dots with phase offsets (separate layers).
    var dots = proj.items.addComp("Dots_Trio_Bounce", 520, 320, 1, DUR, FPS);
    dots.parentFolder = elementsFolder;
    dots.bgColor = COLORS.dark;
    var dotColors = [COLORS.orange, COLORS.pink, COLORS.teal];
    for (var d = 0; d < 3; d++) {
        var dotLayer = dots.layers.addShape();
        dotLayer.name = "Dot " + (d + 1);
        addShapeGroup(dotLayer, { shape: "ellipse", size: [80, 80], fill: dotColors[d] });
        transformOf(dotLayer).property("ADBE Position").setValue([130 + d * 130, 210]);
        transformOf(dotLayer).property("ADBE Position").expression =
            "ph = " + (d * 0.25) + ";\n" +
            "y = -Math.abs(Math.sin((time - ph)*Math.PI*1.0))*80;\n" +
            "value + [0, y]";
    }
    elements.dots = dots;

    // ---------------------- master comps ------------------------
    // Layout as fractions of comp size so it fits every aspect ratio.
    // [element, fracX, fracY, relativeScale, driftAcrossScreen]
    var LAYOUT = [
        [elements.circleBig,   0.16, 0.28, 1.00, false],
        [elements.hexagon,     0.50, 0.42, 1.10, false],
        [elements.squareSmall, 0.82, 0.22, 1.00, false],
        [elements.triangle,    0.72, 0.72, 0.90, false],
        [elements.star,        0.28, 0.74, 0.85, false],
        [elements.ring,        0.88, 0.52, 0.75, false],
        [elements.cross,       0.08, 0.62, 0.80, false],
        [elements.squareBig,   0.38, 0.10, 0.60, false],
        [elements.dots,        0.50, 0.88, 1.00, false],
        [elements.circleSmall, 0.10, 0.90, 0.80, true ],
        [elements.bar,         0.20, 0.08, 0.90, true ]
    ];

    function makeMasterComp(name, w, h) {
        var comp = proj.items.addComp(name, w, h, 1, DUR, FPS);
        comp.parentFolder = masterFolder;
        comp.bgColor = COLORS.dark;

        // Background solid
        var bg = comp.layers.addSolid(COLORS.dark, "Background", w, h, 1, DUR);
        bg.moveToEnd();

        // Two big soft accent circles behind everything
        var accent = comp.layers.addShape();
        accent.name = "Soft Accents";
        addShapeGroup(accent, {
            shape: "ellipse", size: [w * 0.7, w * 0.7], fill: COLORS.blue,
            fillOpacity: 10, groupPosition: [-w * 0.30, -h * 0.25]
        });
        addShapeGroup(accent, {
            shape: "ellipse", size: [w * 0.6, w * 0.6], fill: COLORS.purple,
            fillOpacity: 10, groupPosition: [w * 0.35, h * 0.30]
        });
        transformOf(accent).property("ADBE Position").setValue([w / 2, h / 2]);
        applyAnim(accent, "float");
        accent.moveBefore(bg);

        // Place the elements
        var scaleBase = (Math.min(w, h) / 1080) * 100;
        for (var i = 0; i < LAYOUT.length; i++) {
            var row = LAYOUT[i];
            var layer = comp.layers.add(row[0]);
            layer.collapseTransformation = true;
            var t = transformOf(layer);
            t.property("ADBE Position").setValue([w * row[1], h * row[2]]);
            t.property("ADBE Scale").setValue([scaleBase * row[3], scaleBase * row[3]]);
            if (row[4]) {
                // Drift horizontally across the whole screen and wrap around
                t.property("ADBE Position").expression =
                    "speed = thisComp.width/8; m = 400;\n" +
                    "w = thisComp.width + m;\n" +
                    "x = (value[0] + m/2 + time*speed) % w - m/2;\n" +
                    "[x, value[1]]";
            }
        }
        return comp;
    }

    makeMasterComp("Showcase_FullHD_1920x1080", 1920, 1080);
    makeMasterComp("Showcase_Square_1080x1080", 1080, 1080);
    makeMasterComp("Showcase_Vertical_1080x1920", 1080, 1920);

    app.endUndoGroup();

    alert("Done!\n\n3 master comps (16:9, 1:1, 9:16) and 11 animated elements were created.\n\nOpen '01 - Master Comps' and press Space to preview.\nRemember to save the project (Ctrl/Cmd+S).");

})();
