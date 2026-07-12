// ============================================================
//  TV Studio LED Screens - Moving Elements Project Builder
//  for Adobe After Effects
// ------------------------------------------------------------
//  HOW TO RUN (inside After Effects):
//    File > Scripts > Run Script File...  -> pick this .jsx file
//
//  WHAT IT BUILDS:
//    01 - Studio Screens : one comp per LED screen, exact sizes:
//         BackWall_Main_3200x1200, BackWall_Side_2800x1200,
//         Side_A_1600x1200, Side_B_1600x1200,
//         Vertical_800x1600, Square_1600x1600, Ticker_2880x270
//    02 - Elements       : 11 reusable animated shape elements
//
//  All screens share ONE visual language (same palette, same
//  element set, same motion) and every animation is expression
//  driven so the 10 second comps loop seamlessly.
// ============================================================

(function buildMovingElementsProject() {

    app.beginUndoGroup("Build Studio Screens Project");

    // ------------------------- settings -------------------------
    var FPS = 30;
    var DUR = 10;          // seconds - keep frequencies loop-friendly
    var TWO_PI = "Math.PI*2";

    // Studio palette: dark broadcast look with red/magenta accents.
    // Change these and re-run to restyle every screen at once.
    var COLORS = {
        red:     [0.86, 0.10, 0.16],
        magenta: [0.93, 0.16, 0.45],
        orange:  [1.00, 0.45, 0.15],
        gold:    [1.00, 0.72, 0.20],
        white:   [0.96, 0.96, 0.98],
        grey:    [0.55, 0.58, 0.66],
        dark:    [0.05, 0.04, 0.06]
    };

    // Drift a layer across the full comp width and wrap around.
    // Speed = one full crossing per comp duration -> seamless loop.
    var DRIFT_EXPR =
        "m = 400;\n" +
        "w = thisComp.width + m;\n" +
        "sp = w / " + DUR + ";\n" +
        "x = (value[0] + m/2 + time*sp) % w - m/2;\n" +
        "[x, value[1]]";

    var proj = app.project;
    var masterFolder   = proj.items.addFolder("01 - Studio Screens");
    var elementsFolder = proj.items.addFolder("02 - Elements");

    // ------------------------- helpers --------------------------

    // Adds one shape group (path + fill/stroke) to a shape layer.
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
        [{ shape: "ellipse", size: [340, 340], fill: COLORS.red }],
        ["float"]);

    elements.ring = makeElementComp("Ring_Pulse", 500, 500,
        [{ shape: "ellipse", size: [280, 280], strokeColor: COLORS.magenta, strokeWidth: 24 }],
        ["pulse", "breatheOpacity"]);

    elements.squareSmall = makeElementComp("Square_Small_Spin", 400, 400,
        [{ shape: "rect", size: [150, 150], roundness: 16, fill: COLORS.magenta }],
        ["spin", "float"]);

    elements.squareBig = makeElementComp("Square_Big_Rounded_Float", 600, 600,
        [{ shape: "rect", size: [300, 300], roundness: 60, fill: COLORS.red }],
        ["float", "spinBack"]);

    elements.triangle = makeElementComp("Triangle_Spin", 500, 500,
        [{ shape: "poly", points: 3, outerRadius: 150, fill: COLORS.gold }],
        ["spin", "float"]);

    elements.hexagon = makeElementComp("Hexagon_Rotate", 600, 600,
        [{ shape: "poly", points: 6, outerRadius: 200, strokeColor: COLORS.red, strokeWidth: 18 }],
        ["spinBack", "pulse"]);

    elements.star = makeElementComp("Star_Twinkle", 500, 500,
        [{ shape: "star", points: 5, outerRadius: 160, innerRadius: 75, fill: COLORS.gold }],
        ["spin", "pulse", "breatheOpacity"]);

    elements.bar = makeElementComp("Bar_Sway", 700, 300,
        [{ shape: "rect", size: [420, 70], roundness: 35, fill: COLORS.magenta }],
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
    var dotColors = [COLORS.orange, COLORS.magenta, COLORS.gold];
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

    // ---------------------- studio screens ----------------------
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

    // One comp per physical LED screen.
    // variant shifts + mirrors the layout so same-size screens
    // don't look identical while keeping the same visual language.
    function makeScreenComp(name, w, h, variant) {
        var comp = proj.items.addComp(name, w, h, 1, DUR, FPS);
        comp.parentFolder = masterFolder;
        comp.bgColor = COLORS.dark;

        var bg = comp.layers.addSolid(COLORS.dark, "Background", w, h, 1, DUR);
        bg.moveToEnd();

        // Soft glow accents behind everything (shared look on all screens)
        var accent = comp.layers.addShape();
        accent.name = "Soft Accents";
        var acSize = Math.min(w, h) * 1.4;
        addShapeGroup(accent, {
            shape: "ellipse", size: [acSize, acSize], fill: COLORS.red,
            fillOpacity: 10, groupPosition: [-w * 0.30, -h * 0.25]
        });
        addShapeGroup(accent, {
            shape: "ellipse", size: [acSize * 0.85, acSize * 0.85], fill: COLORS.magenta,
            fillOpacity: 8, groupPosition: [w * 0.35, h * 0.30]
        });
        transformOf(accent).property("ADBE Position").setValue([w / 2, h / 2]);
        applyAnim(accent, "float");

        var i, layer, t, sc;
        var isTicker = (w / h) >= 4;

        if (isTicker) {
            // Ultra-wide strip: a row of small elements drifting across
            var picks = [elements.star, elements.circleSmall, elements.triangle,
                         elements.squareSmall, elements.cross, elements.ring,
                         elements.dots, elements.hexagon];
            var n = Math.max(4, Math.round(w / (h * 2.0)));
            for (i = 0; i < n; i++) {
                var el = picks[i % picks.length];
                layer = comp.layers.add(el);
                layer.collapseTransformation = true;
                t = transformOf(layer);
                sc = (h * 0.85) / el.height * 100;
                t.property("ADBE Position").setValue([w * (i + 0.5) / n, h * 0.52]);
                t.property("ADBE Scale").setValue([sc, sc]);
                t.property("ADBE Position").expression = DRIFT_EXPR;
            }
        } else {
            var scaleBase = (Math.min(w, h) / 1080) * 100;
            var start = (variant || 0) * 3;
            for (i = 0; i < LAYOUT.length; i++) {
                var row = LAYOUT[(i + start) % LAYOUT.length];
                var fx = row[1];
                if ((variant || 0) % 2 === 1) fx = 1 - fx;
                layer = comp.layers.add(row[0]);
                layer.collapseTransformation = true;
                t = transformOf(layer);
                t.property("ADBE Position").setValue([w * fx, h * row[2]]);
                t.property("ADBE Scale").setValue([scaleBase * row[3], scaleBase * row[3]]);
                if (row[4]) t.property("ADBE Position").expression = DRIFT_EXPR;
            }
        }
        return comp;
    }

    // Exact physical screen sizes from the studio plan
    makeScreenComp("BackWall_Main_3200x1200", 3200, 1200, 0);
    makeScreenComp("BackWall_Side_2800x1200", 2800, 1200, 1);
    makeScreenComp("Side_A_1600x1200",        1600, 1200, 2);
    makeScreenComp("Side_B_1600x1200",        1600, 1200, 3);
    makeScreenComp("Vertical_800x1600",        800, 1600, 4);
    makeScreenComp("Square_1600x1600",        1600, 1600, 5);
    makeScreenComp("Ticker_2880x270",         2880,  270, 0);

    app.endUndoGroup();

    alert("Done!\n\n7 studio screen comps + 11 animated elements were created.\n\nOpen '01 - Studio Screens' and press Space to preview.\nAll comps loop seamlessly every " + DUR + " seconds.\nRemember to save the project (Ctrl/Cmd+S).");

})();
