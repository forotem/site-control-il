// ============================================================
//  TV Studio LED Wall - Unified Broadcast Background Builder
//  for Adobe After Effects
// ------------------------------------------------------------
//  HOW TO RUN (inside After Effects):
//    File > Scripts > Run Script File...  -> pick this .jsx file
//
//  ARCHITECTURE - ONE UNIFIED WALL:
//    00 - Master Wall    : Studio_Master_11600x1600 - the whole
//                          studio wall designed as ONE canvas.
//                          Motion starts on the right-most screen,
//                          travels across every screen and back.
//    01 - Studio Screens : one comp per physical LED screen, each
//                          is a window into the master at its real
//                          position - render each at its exact size
//                          and, played together, they form one
//                          continuous picture with one direction.
//    02 - Elements       : reusable broadcast accents
//    03 - Textures       : auto-imported from a ./textures folder
//                          next to this script (optional)
//
//  Physical wall order (left to right, from the studio plan):
//    Side_A 1600x1200 | Side_B 1600x1200 | Vertical 800x1600 |
//    BackWall_Main 3200x1200 | BackWall_Side 2800x1200 |
//    Square 1600x1600      (+ Ticker 2880x270 above the main wall)
//  Change SCREENS below if the physical order differs.
//
//  All motion is slow and subtle; every 10s comp loops seamlessly.
// ============================================================

(function buildStudioWallProject() {

    app.beginUndoGroup("Build Unified Studio Wall Project");

    // ------------------------- settings -------------------------
    var FPS = 30;
    var DUR = 10;          // seconds - keep frequencies loop-friendly
    var TWO_PI = "Math.PI*2";

    // Palette sampled from the reference frame.
    // Change these and re-run to restyle the whole wall at once.
    var COLORS = {
        magenta: [0.95, 0.15, 0.50],   // dominant beam / floor line
        red:     [0.90, 0.08, 0.25],   // deep accents
        blue:    [0.60, 0.80, 1.00],   // cool neon floor line
        white:   [0.96, 0.96, 1.00],
        grey:    [0.58, 0.61, 0.68],   // chevrons, ticks, hairlines
        panelA:  [0.085, 0.095, 0.125],// dark slab
        panelB:  [0.115, 0.125, 0.160],// lighter slab
        black:   [0, 0, 0],
        dark:    [0.035, 0.040, 0.055] // wall
    };

    // Master wall canvas (sum of all screen widths x tallest screen)
    var MW = 11600, MH = 1600;
    var FLOOR_Y = MH * 0.92;
    var ES = 1200 / 1080;              // element scale base for the wall

    // Physical screens as windows into the master wall.
    // rx, ry = top-left corner of the screen's region on the master
    // (bottom-aligned: every screen stands on the same floor line).
    var SCREENS = [
        { name: "Side_A_1600x1200",        w: 1600, h: 1200, rx: 0,     ry: 400 },
        { name: "Side_B_1600x1200",        w: 1600, h: 1200, rx: 1600,  ry: 400 },
        { name: "Vertical_800x1600",       w: 800,  h: 1600, rx: 3200,  ry: 0   },
        { name: "BackWall_Main_3200x1200", w: 3200, h: 1200, rx: 4000,  ry: 400 },
        { name: "BackWall_Side_2800x1200", w: 2800, h: 1200, rx: 7200,  ry: 400 },
        { name: "Square_1600x1600",        w: 1600, h: 1600, rx: 10000, ry: 0   },
        { name: "Ticker_2880x270",         w: 2880, h: 270,  rx: 4200,  ry: 90  }
    ];

    // Ping-pong travel: starts at the RIGHT edge, crosses the whole
    // wall to the left and comes back - once per loop, seamlessly.
    function pingPongExpr(margin) {
        return "m = " + margin + ";\n" +
               "p = 0.5 + 0.5*Math.cos(time*" + TWO_PI + "/" + DUR + ");\n" +
               "[-m + p*(thisComp.width + 2*m), value[1]]";
    }

    var proj = app.project;
    var wallFolder     = proj.items.addFolder("00 - Master Wall");
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
            stroke.property("ADBE Vector Stroke Width").setValue(spec.strokeWidth || 4);
            if (spec.dash) {
                stroke.property("ADBE Vector Stroke Dashes")
                      .addProperty("ADBE Vector Stroke Dash 1").setValue(spec.dash);
            }
        }

        var gt = group.property("ADBE Vector Transform Group");
        if (spec.groupPosition) gt.property("ADBE Vector Position").setValue(spec.groupPosition);
        if (spec.groupRotation) gt.property("ADBE Vector Rotation").setValue(spec.groupRotation);

        return group;
    }

    function transformOf(layer) {
        return layer.property("ADBE Transform Group");
    }

    function addBlur(layer, amount) {
        var fx = layer.property("ADBE Effect Parade").addProperty("ADBE Gaussian Blur 2");
        fx.property("ADBE Gaussian Blur 2-0001").setValue(amount);
        fx.property("ADBE Gaussian Blur 2-0002").setValue(1); // repeat edge pixels
    }

    // Slow horizontal sway - phase keeps parallax between layers,
    // freq * DUR is an integer so the loop stays seamless.
    function applySway(layer, amp, phase) {
        transformOf(layer).property("ADBE Position").expression =
            "value + [Math.sin(time*" + TWO_PI + "*0.1 + " + phase + ")*" + amp + ", 0]";
    }

    function applyBreath(layer, base, amp, freq) {
        transformOf(layer).property("ADBE Opacity").expression =
            base + " + Math.sin(time*" + TWO_PI + "*" + freq + ")*" + amp;
    }

    // ---------------- reusable accent elements ------------------
    var elements = {};

    // Fine dot-matrix panel (dense, small dots - like the wall texture)
    (function () {
        var cols = 18, rows = 12, gap = 26;
        var w = 480, h = 340;
        var comp = proj.items.addComp("DotGrid_Panel", w, h, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Dots";
        transformOf(layer).property("ADBE Position").setValue([w / 2, h / 2]);
        for (var r = 0; r < rows; r++) {
            for (var c = 0; c < cols; c++) {
                addShapeGroup(layer, {
                    shape: "ellipse", size: [4.5, 4.5], fill: COLORS.white, fillOpacity: 75,
                    groupPosition: [(c - (cols - 1) / 2) * gap, (r - (rows - 1) / 2) * gap]
                });
            }
        }
        applyBreath(layer, 58, 18, 0.3);   // gentle shimmer
        elements.dotGrid = comp;
    })();

    // Diagonal hatch-line block (the striped patch under the beam)
    (function () {
        var lines = 13, gap = 22;
        var w = 340, h = 380;
        var comp = proj.items.addComp("Hatch_Lines", w, h, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Hatch";
        transformOf(layer).property("ADBE Position").setValue([w / 2, h / 2]);
        for (var i = 0; i < lines; i++) {
            addShapeGroup(layer, {
                shape: "rect", size: [3, 320], fill: COLORS.white, fillOpacity: 60,
                groupPosition: [(i - (lines - 1) / 2) * gap, 0]
            });
        }
        applyBreath(layer, 55, 15, 0.2);
        elements.hatch = comp;
    })();

    // Thin grey chevron trail ">>>>>" with running-light opacity.
    // The running light moves in the SAME direction on every screen.
    (function () {
        var comp = proj.items.addComp("Chevron_Trail", 330, 110, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        for (var i = 0; i < 5; i++) {
            var layer = comp.layers.addShape();
            layer.name = "Chevron " + (i + 1);
            addShapeGroup(layer, {
                shape: "rect", size: [36, 6], roundness: 3, fill: COLORS.grey,
                groupRotation: 45, groupPosition: [0, -12]
            });
            addShapeGroup(layer, {
                shape: "rect", size: [36, 6], roundness: 3, fill: COLORS.grey,
                groupRotation: -45, groupPosition: [0, 12]
            });
            transformOf(layer).property("ADBE Position").setValue([45 + i * 60, 55]);
            transformOf(layer).property("ADBE Opacity").expression =
                "ph = " + (i * 0.8) + ";\n" +
                "(Math.sin(time*" + TWO_PI + "*0.5 - ph)+1)/2*55 + 25";
        }
        elements.chevrons = comp;
    })();

    // Set of fine horizontal hairlines (stacked rules)
    (function () {
        var comp = proj.items.addComp("Hairline_Set", 400, 120, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Hairlines";
        var specs = [[300, 60], [220, 40], [140, 28]];
        for (var i = 0; i < specs.length; i++) {
            addShapeGroup(layer, {
                shape: "rect", size: [specs[i][0], 2.5], fill: COLORS.grey,
                fillOpacity: specs[i][1],
                groupPosition: [specs[i][0] / 2 - 150, (i - 1) * 14]
            });
        }
        transformOf(layer).property("ADBE Position").setValue([200, 60]);
        applySway(layer, 10, 0);
        elements.hairlines = comp;
    })();

    // Technical registration mark: "+" with a long hairline
    // extending sideways and small dashes below (blueprint style)
    (function () {
        var comp = proj.items.addComp("RegMark_Plus", 280, 160, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "RegMark";
        addShapeGroup(layer, { shape: "rect", size: [26, 2.5], fill: COLORS.grey });              // plus
        addShapeGroup(layer, { shape: "rect", size: [2.5, 26], fill: COLORS.grey });
        addShapeGroup(layer, {                                                                    // hairline
            shape: "rect", size: [150, 1.8], fill: COLORS.grey, fillOpacity: 55,
            groupPosition: [95, 0]
        });
        addShapeGroup(layer, {                                                                    // dashes
            shape: "rect", size: [1.8, 12], fill: COLORS.grey, fillOpacity: 60,
            groupPosition: [0, 38]
        });
        addShapeGroup(layer, {
            shape: "rect", size: [1.8, 7], fill: COLORS.grey, fillOpacity: 40,
            groupPosition: [0, 62]
        });
        transformOf(layer).property("ADBE Position").setValue([80, 70]);
        applyBreath(layer, 50, 30, 0.5);
        elements.tick = comp;
    })();

    // Dashed tech ring (extra asset, also used as small detail)
    (function () {
        var comp = proj.items.addComp("Ring_Tech_Dashed", 400, 400, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Ring";
        addShapeGroup(layer, {
            shape: "ellipse", size: [280, 280],
            strokeColor: COLORS.grey, strokeWidth: 3, dash: 30
        });
        transformOf(layer).property("ADBE Position").setValue([200, 200]);
        transformOf(layer).property("ADBE Rotate Z").expression = "time * 36";
        applyBreath(layer, 45, 15, 0.2);
        elements.ring = comp;
    })();

    // ---------------- wall building blocks -----------------------
    // All take absolute pixel positions on the master wall.

    // Big soft glow, breathing slowly (blurred disc)
    function addGlow(comp, x, y, size, color, opacity) {
        var layer = comp.layers.addShape();
        layer.name = "Glow";
        addShapeGroup(layer, { shape: "ellipse", size: [size, size], fill: color });
        transformOf(layer).property("ADBE Position").setValue([x, y]);
        transformOf(layer).property("ADBE Opacity").setValue(opacity);
        addBlur(layer, size * 0.35);
        applyBreath(layer, opacity, opacity * 0.35, 0.2);
        return layer;
    }

    // Dark diagonal slab with a subtly lit right edge (set-piece panel)
    function addPanel(comp, x, rot, width, color, phase) {
        var len = MH * 3.2;
        var layer = comp.layers.addShape();
        layer.name = "Panel";
        addShapeGroup(layer, { shape: "rect", size: [width, len], fill: color });
        addShapeGroup(layer, {                       // lit edge
            shape: "rect", size: [3, len], fill: COLORS.white, fillOpacity: 16,
            groupPosition: [width / 2, 0]
        });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([x, MH / 2]);
        t.property("ADBE Rotate Z").setValue(rot);
        applySway(layer, 4, phase);                  // barely moving - set piece
        return layer;
    }

    // Diagonal light beam; hot=true adds a glowing core near the top
    // (approximates the reference's bright-to-dark gradient beam)
    function addBeam(comp, x, rot, width, color, opacity, blur, phase, hot) {
        var len = MH * 3.2;
        var layer = comp.layers.addShape();
        layer.name = "Beam";
        addShapeGroup(layer, { shape: "rect", size: [width, len], fill: color });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([x, MH / 2]);
        t.property("ADBE Rotate Z").setValue(rot);
        t.property("ADBE Opacity").setValue(opacity);
        if (blur) addBlur(layer, blur);
        applySway(layer, 10 + blur * 0.08, phase);

        if (hot) {
            var d = MH * 0.28;                       // offset up along the beam axis
            var rad = rot * Math.PI / 180;
            var core = comp.layers.addShape();
            core.name = "Beam Hot Core";
            addShapeGroup(core, { shape: "rect", size: [width * 0.55, len * 0.35], fill: COLORS.white });
            var ct = transformOf(core);
            ct.property("ADBE Position").setValue([x + Math.sin(rad) * d, MH / 2 - Math.cos(rad) * d]);
            ct.property("ADBE Rotate Z").setValue(rot);
            ct.property("ADBE Opacity").setValue(30);
            addBlur(core, 55);
            core.blendingMode = BlendingMode.ADD;
            applySway(core, 10, phase);
        }
        return layer;
    }

    // Depth shading - what makes the wall read as 3D:
    // dark falloff toward the ceiling, vignetted edges, floor glow
    function addDepthShading(comp) {
        var top = comp.layers.addShape();
        top.name = "Shade Top";
        addShapeGroup(top, { shape: "rect", size: [MW * 1.2, MH * 0.55], fill: COLORS.black });
        transformOf(top).property("ADBE Position").setValue([MW / 2, MH * 0.10]);
        transformOf(top).property("ADBE Opacity").setValue(55);
        addBlur(top, 150);

        var left = comp.layers.addShape();
        left.name = "Shade Left";
        addShapeGroup(left, { shape: "rect", size: [MW * 0.06, MH * 1.4], fill: COLORS.black });
        transformOf(left).property("ADBE Position").setValue([0, MH / 2]);
        transformOf(left).property("ADBE Opacity").setValue(45);
        addBlur(left, 180);

        var right = comp.layers.addShape();
        right.name = "Shade Right";
        addShapeGroup(right, { shape: "rect", size: [MW * 0.06, MH * 1.4], fill: COLORS.black });
        transformOf(right).property("ADBE Position").setValue([MW, MH / 2]);
        transformOf(right).property("ADBE Opacity").setValue(45);
        addBlur(right, 180);
    }

    // Continuous double neon floor line across the WHOLE wall:
    // magenta above, cool white core, and a bright runner that
    // starts on the right-most screen, travels to the far left
    // and returns - the motion that ties all screens together.
    function addFloorLines(comp, y) {
        var mag = comp.layers.addShape();
        mag.name = "Floor Line Magenta";
        addShapeGroup(mag, { shape: "rect", size: [MW * 1.05, 4], fill: COLORS.magenta });
        transformOf(mag).property("ADBE Position").setValue([MW / 2, y - MH * 0.02]);
        addBlur(mag, 8);
        applyBreath(mag, 70, 18, 0.2);

        var glow = comp.layers.addShape();
        glow.name = "Floor Line Glow";
        addShapeGroup(glow, { shape: "rect", size: [MW * 1.05, 9], fill: COLORS.blue });
        transformOf(glow).property("ADBE Position").setValue([MW / 2, y]);
        addBlur(glow, 22);
        applyBreath(glow, 50, 15, 0.3);

        var core = comp.layers.addShape();
        core.name = "Floor Line Core";
        addShapeGroup(core, { shape: "rect", size: [MW * 1.05, 3.5], fill: COLORS.white });
        transformOf(core).property("ADBE Position").setValue([MW / 2, y]);
        transformOf(core).property("ADBE Opacity").setValue(88);

        var runner = comp.layers.addShape();
        runner.name = "Floor Runner";
        addShapeGroup(runner, { shape: "rect", size: [420, 5], roundness: 3, fill: COLORS.white });
        transformOf(runner).property("ADBE Position").setValue([0, y]);
        addBlur(runner, 8);
        runner.blendingMode = BlendingMode.ADD;
        transformOf(runner).property("ADBE Position").expression = pingPongExpr(400);
    }

    // Thin circle lying on the floor (like the ring around the candle)
    function addFloorEllipse(comp, x, y, size) {
        var layer = comp.layers.addShape();
        layer.name = "Floor Circle";
        addShapeGroup(layer, {
            shape: "ellipse", size: [size, size * 0.28],
            strokeColor: COLORS.red, strokeWidth: 3
        });
        transformOf(layer).property("ADBE Position").setValue([x, y]);
        applyBreath(layer, 40, 14, 0.2);
        return layer;
    }

    // Soft light streak that starts on the right-most screen,
    // sweeps across the whole wall and returns - once per loop.
    function addSweep(comp) {
        var layer = comp.layers.addShape();
        layer.name = "Light Sweep";
        addShapeGroup(layer, { shape: "rect", size: [MH * 0.22, MH * 3.2], fill: COLORS.white });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([0, MH / 2]);
        t.property("ADBE Rotate Z").setValue(14);
        t.property("ADBE Opacity").setValue(9);
        addBlur(layer, 90);
        t.property("ADBE Position").expression = pingPongExpr(900);
        layer.blendingMode = BlendingMode.ADD;
    }

    // Subtle live grain over everything - gives the cinematic
    // texture of the reference and prevents banding on LED walls
    function addGrain(comp) {
        var adj = comp.layers.addSolid([1, 1, 1], "Grain", comp.width, comp.height, 1, DUR);
        adj.adjustmentLayer = true;
        var fx = adj.property("ADBE Effect Parade").addProperty("ADBE Noise");
        fx.property("ADBE Noise-0001").setValue(4); // amount %
        return adj;
    }

    // Place a reusable element comp at an absolute wall position
    function place(comp, element, x, y, rel, opacity, rotation) {
        var layer = comp.layers.add(element);
        layer.collapseTransformation = true;
        var sc = ES * 100 * rel;
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([x, y]);
        t.property("ADBE Scale").setValue([sc, sc]);
        if (opacity !== undefined) t.property("ADBE Opacity").setValue(opacity);
        if (rotation) t.property("ADBE Rotate Z").setValue(rotation);
        return layer;
    }

    // ---------------------- the master wall ----------------------
    var master = proj.items.addComp("Studio_Master_" + MW + "x" + MH, MW, MH, 1, DUR, FPS);
    master.parentFolder = wallFolder;
    master.bgColor = COLORS.dark;

    var ROT = 22;   // ONE beam direction for the whole wall

    var bg = master.layers.addSolid(COLORS.dark, "Background", MW, MH, 1, DUR);
    bg.moveToEnd();

    // wall lights + warm floor reflections
    addGlow(master, 1600, MH * 0.35, 1300, [0.16, 0.17, 0.21], 50);
    addGlow(master, 5600, MH * 0.35, 1500, [0.16, 0.17, 0.21], 55);
    addGlow(master, 9200, MH * 0.35, 1300, [0.16, 0.17, 0.21], 50);
    addGlow(master, 6100, FLOOR_Y + 60, 700, COLORS.magenta, 12);
    addGlow(master, 2900, FLOOR_Y + 60, 520, COLORS.magenta, 9);
    addGlow(master, 9600, FLOOR_Y + 60, 520, COLORS.magenta, 9);

    // --- neon edge frame on the far left (like the reference's corner)
    addBeam(master, 350, ROT, 8, COLORS.magenta, 85, 3, 0.2, false);
    addBeam(master, 720, ROT, 4, COLORS.blue,    50, 2, 0.9, false);

    // --- cluster at the Side_B / Vertical junction
    addPanel(master, 3060, ROT, 340, COLORS.panelB, 0.5);
    addBeam(master, 2950, ROT, 95, COLORS.magenta, 72, 0, 1.0, false);
    addBeam(master, 3270, ROT, 30, COLORS.red,     55, 0, 1.8, false);
    addBeam(master, 2760, ROT, 4,  COLORS.white,   26, 0, 2.6, false);

    // --- DOMINANT cluster in the middle of the main back wall
    addBeam(master, 6000, ROT, 800, COLORS.black,  45, 160, 0.4, false);   // depth shadow
    addPanel(master, 6150, ROT, 660, COLORS.panelA, 0.9);
    addPanel(master, 5800, ROT, 400, COLORS.panelB, 1.6);
    addPanel(master, 5480, ROT, 120, COLORS.panelA, 2.3);
    addBeam(master, 5950, ROT, 310, COLORS.magenta, 16, 110, 0.6, false);  // soft wash
    addBeam(master, 5950, ROT, 130, COLORS.magenta, 88, 0, 0.6, true);     // THE beam
    addBeam(master, 6350, ROT, 34,  COLORS.red,     60, 0, 1.4, false);
    addBeam(master, 5330, ROT, 5,   COLORS.white,   30, 0, 2.2, false);
    addBeam(master, 6600, ROT, 5,   COLORS.white,   22, 0, 3.0, false);

    // --- cluster on the secondary back wall
    addPanel(master, 9350, ROT, 300, COLORS.panelB, 1.2);
    addBeam(master, 9230, ROT, 70, COLORS.magenta, 58, 0, 2.0, false);
    addBeam(master, 9040, ROT, 4,  COLORS.white,   24, 0, 2.8, false);

    // --- faint echo on the square end screen
    addBeam(master, 11150, ROT, 40, COLORS.red,   48, 0, 1.1, false);
    addBeam(master, 11360, ROT, 3,  COLORS.white, 20, 0, 1.9, false);

    // --- accents across the wall (chevrons all point the SAME way -
    //     toward the travel direction of the sweep)
    place(master, elements.dotGrid,   1250,  820, 1.55, 65);
    place(master, elements.dotGrid,   4650,  560, 0.80, 35);
    place(master, elements.dotGrid,   8350,  760, 1.20, 50);
    place(master, elements.dotGrid,  10850,  620, 0.70, 30);
    place(master, elements.hatch,     6120, 1050, 1.00, 60, ROT);
    place(master, elements.hatch,     2870, 1100, 0.70, 45, ROT);
    place(master, elements.hairlines, 4550,  700, 0.90, 65);
    place(master, elements.hairlines, 7800,  640, 0.90, 60);
    place(master, elements.hairlines,10650,  900, 0.80, 55);
    place(master, elements.chevrons,   900,  900, 0.60, 75, 180);
    place(master, elements.chevrons,  5150,  980, 0.50, 60, 180);
    place(master, elements.chevrons,  8000, 1000, 0.50, 60, 180);
    place(master, elements.chevrons, 10500,  880, 0.45, 55, 180);
    place(master, elements.tick,       520, 1050, 0.80);
    place(master, elements.tick,      3550,  980, 0.60);
    place(master, elements.tick,      7050,  500, 0.70);
    place(master, elements.tick,      9800,  560, 0.60);
    place(master, elements.ring,      7500,  880, 0.50, 35);

    // --- extra accents high up, visible only on the ticker strip
    place(master, elements.chevrons,  4600,  230, 0.40, 60, 180);
    place(master, elements.tick,      5300,  200, 0.50, 55);
    place(master, elements.hairlines, 6600,  240, 0.60, 50);

    // --- floor, depth, traveling light, grain
    addFloorLines(master, FLOOR_Y);
    addFloorEllipse(master, 6200, MH * 0.965, 500);
    addDepthShading(master);
    addSweep(master);
    addGrain(master);

    // ---------------------- screen windows -----------------------
    // Each physical screen shows its region of the master wall.
    // Render each comp at its exact size; played together on the
    // set they reassemble into one continuous, unified picture.
    for (var s = 0; s < SCREENS.length; s++) {
        var scr = SCREENS[s];
        var comp = proj.items.addComp(scr.name, scr.w, scr.h, 1, DUR, FPS);
        comp.parentFolder = masterFolder;
        comp.bgColor = COLORS.dark;
        var win = comp.layers.add(master);
        transformOf(win).property("ADBE Position").setValue([MW / 2 - scr.rx, MH / 2 - scr.ry]);
    }

    // ---------------- optional texture import -------------------
    // Drop AI-generated textures (PNG/JPG/MP4/MOV) into a folder
    // named "textures" next to this script and they will be
    // imported into "03 - Textures" automatically.
    var texNote = "";
    try {
        var scriptFile = new File($.fileName);
        var texDir = new Folder(scriptFile.parent.fsName + "/textures");
        if (texDir.exists) {
            var texFiles = texDir.getFiles();
            var texBin = null, imported = 0;
            for (var tf = 0; tf < texFiles.length; tf++) {
                var f = texFiles[tf];
                if (f instanceof File && f.name.match(/\.(png|jpg|jpeg|tif|tiff|mp4|mov)$/i)) {
                    if (!texBin) texBin = proj.items.addFolder("03 - Textures");
                    var item = proj.importFile(new ImportOptions(f));
                    item.parentFolder = texBin;
                    imported++;
                }
            }
            if (imported) texNote = "\n" + imported + " texture file(s) imported into '03 - Textures'.";
        }
    } catch (err) {}

    app.endUndoGroup();

    alert("Done!\n\nOne unified master wall (" + MW + "x" + MH + ") + " + SCREENS.length +
          " screen windows + 6 reusable accents were created." + texNote +
          "\n\nOpen 'Studio_Master...' to see the whole wall at once,\n" +
          "or any comp in '01 - Studio Screens' for a single screen.\n" +
          "All comps loop seamlessly every " + DUR + " seconds.\n" +
          "Remember to save the project (Ctrl/Cmd+S).");

})();
