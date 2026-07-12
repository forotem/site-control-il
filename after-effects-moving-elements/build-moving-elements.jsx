// ============================================================
//  TV Studio LED Screens - Broadcast Background Builder
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
//    02 - Elements       : reusable broadcast accents
//         (dot grid, chevron trail, tech ring, hairlines, ticks)
//
//  DESIGN LANGUAGE (shared by every screen):
//    dark broadcast wall + diagonal light beams + soft glows
//    + dot-grid panel + neon floor line + drifting chevrons
//    + a light sweep that crosses the screen once per loop.
//  All motion is slow, subtle and expression driven, so every
//  10 second comp loops seamlessly.
// ============================================================

(function buildStudioScreensProject() {

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
        gold:    [1.00, 0.72, 0.20],
        white:   [0.96, 0.96, 0.98],
        grey:    [0.55, 0.58, 0.66],
        dark:    [0.05, 0.04, 0.06]
    };

    // Drift a layer across the full comp width and wrap around.
    // Speed = one full crossing per comp duration -> seamless loop.
    var DRIFT_EXPR =
        "m = 500;\n" +
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
            stroke.property("ADBE Vector Stroke Width").setValue(spec.strokeWidth || 6);
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

    // Dot-matrix panel (like the dotted texture on the studio wall)
    (function () {
        var w = 620, h = 400, gap = 55;
        var comp = proj.items.addComp("DotGrid_Panel", w, h, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Dots";
        transformOf(layer).property("ADBE Position").setValue([w / 2, h / 2]);
        for (var r = 0; r < 7; r++) {
            for (var c = 0; c < 10; c++) {
                addShapeGroup(layer, {
                    shape: "ellipse", size: [6, 6], fill: COLORS.white, fillOpacity: 70,
                    groupPosition: [c * gap - 4.5 * gap, r * gap - 3 * gap]
                });
            }
        }
        applyBreath(layer, 60, 25, 0.3);   // gentle shimmer
        elements.dotGrid = comp;
    })();

    // Chevron trail ">>>" with running-light opacity
    (function () {
        var comp = proj.items.addComp("Chevron_Trail", 420, 200, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        for (var i = 0; i < 3; i++) {
            var layer = comp.layers.addShape();
            layer.name = "Chevron " + (i + 1);
            addShapeGroup(layer, {
                shape: "rect", size: [80, 14], roundness: 7, fill: COLORS.magenta,
                groupRotation: 45, groupPosition: [0, -27]
            });
            addShapeGroup(layer, {
                shape: "rect", size: [80, 14], roundness: 7, fill: COLORS.magenta,
                groupRotation: -45, groupPosition: [0, 27]
            });
            transformOf(layer).property("ADBE Position").setValue([90 + i * 120, 100]);
            transformOf(layer).property("ADBE Opacity").expression =
                "ph = " + (i * 1.0) + ";\n" +
                "(Math.sin(time*" + TWO_PI + "*0.5 - ph)+1)/2*70 + 25";
        }
        elements.chevrons = comp;
    })();

    // Dashed "tech" ring, slow rotation
    (function () {
        var comp = proj.items.addComp("Ring_Tech_Dashed", 500, 500, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Ring";
        addShapeGroup(layer, {
            shape: "ellipse", size: [320, 320],
            strokeColor: COLORS.grey, strokeWidth: 5, dash: 40
        });
        addShapeGroup(layer, {
            shape: "ellipse", size: [250, 250],
            strokeColor: COLORS.red, strokeWidth: 3, dash: 24
        });
        transformOf(layer).property("ADBE Position").setValue([250, 250]);
        transformOf(layer).property("ADBE Rotate Z").expression = "time * 36";
        applyBreath(layer, 55, 20, 0.2);
        elements.ring = comp;
    })();

    // Set of fine horizontal hairlines (like the mock-up rules)
    (function () {
        var comp = proj.items.addComp("Hairline_Set", 400, 120, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Hairlines";
        var specs = [[300, 80], [200, 50], [120, 35]];
        for (var i = 0; i < specs.length; i++) {
            addShapeGroup(layer, {
                shape: "rect", size: [specs[i][0], 3], fill: COLORS.white,
                fillOpacity: specs[i][1],
                groupPosition: [specs[i][0] / 2 - 150, (i - 1) * 16]
            });
        }
        transformOf(layer).property("ADBE Position").setValue([200, 60]);
        applySway(layer, 12, 0);
        elements.hairlines = comp;
    })();

    // Small "+" registration tick, twinkling
    (function () {
        var comp = proj.items.addComp("Tick_Plus", 120, 120, 1, DUR, FPS);
        comp.parentFolder = elementsFolder;
        comp.bgColor = COLORS.dark;
        var layer = comp.layers.addShape();
        layer.name = "Tick";
        addShapeGroup(layer, { shape: "rect", size: [28, 3], fill: COLORS.white });
        addShapeGroup(layer, { shape: "rect", size: [3, 28], fill: COLORS.white });
        transformOf(layer).property("ADBE Position").setValue([60, 60]);
        applyBreath(layer, 55, 40, 0.5);
        elements.tick = comp;
    })();

    // ---------------- per-screen building blocks ----------------

    // Big soft glow, breathing slowly (blurred disc)
    function addGlow(comp, pos, size, color, opacity) {
        var layer = comp.layers.addShape();
        layer.name = "Glow";
        addShapeGroup(layer, { shape: "ellipse", size: [size, size], fill: color });
        transformOf(layer).property("ADBE Position").setValue(pos);
        transformOf(layer).property("ADBE Opacity").setValue(opacity);
        addBlur(layer, size * 0.35);
        applyBreath(layer, opacity, opacity * 0.35, 0.2);
        return layer;
    }

    // Diagonal light beam (the signature studio slashes)
    function addBeam(comp, x, rotation, width, color, opacity, blur, phase) {
        var len = (comp.width + comp.height) * 1.6;
        var layer = comp.layers.addShape();
        layer.name = "Beam";
        addShapeGroup(layer, { shape: "rect", size: [width, len], fill: color });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([x, comp.height / 2]);
        t.property("ADBE Rotate Z").setValue(rotation);
        t.property("ADBE Opacity").setValue(opacity);
        if (blur) addBlur(layer, blur);
        applySway(layer, 14 + blur * 0.1, phase);
        return layer;
    }

    // Neon line near the floor: glow + white core + a bright runner
    function addFloorLine(comp, yFrac) {
        var w = comp.width, y = comp.height * yFrac;

        var glow = comp.layers.addShape();
        glow.name = "Floor Line Glow";
        addShapeGroup(glow, { shape: "rect", size: [w * 1.1, 10], fill: COLORS.magenta });
        transformOf(glow).property("ADBE Position").setValue([w / 2, y]);
        addBlur(glow, 26);
        applyBreath(glow, 55, 20, 0.2);

        var core = comp.layers.addShape();
        core.name = "Floor Line";
        addShapeGroup(core, { shape: "rect", size: [w * 1.1, 4], fill: COLORS.white });
        transformOf(core).property("ADBE Position").setValue([w / 2, y]);
        transformOf(core).property("ADBE Opacity").setValue(85);

        var runner = comp.layers.addShape();
        runner.name = "Floor Runner";
        addShapeGroup(runner, { shape: "rect", size: [comp.height * 0.35, 5], roundness: 3, fill: COLORS.white });
        transformOf(runner).property("ADBE Position").setValue([0, y]);
        addBlur(runner, 8);
        transformOf(runner).property("ADBE Position").expression = DRIFT_EXPR;
    }

    // Soft light streak that sweeps across once per loop
    function addSweep(comp) {
        var layer = comp.layers.addShape();
        layer.name = "Light Sweep";
        var len = (comp.width + comp.height) * 1.6;
        addShapeGroup(layer, { shape: "rect", size: [comp.height * 0.25, len], fill: COLORS.white });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([0, comp.height / 2]);
        t.property("ADBE Rotate Z").setValue(14);
        t.property("ADBE Opacity").setValue(10);
        addBlur(layer, 90);
        t.property("ADBE Position").expression =
            "m = 700;\n" +
            "p = (time % " + DUR + ") / " + DUR + ";\n" +
            "[-m + p * (thisComp.width + 2*m), value[1]]";
        layer.blendingMode = BlendingMode.ADD;
    }

    // Place a reusable element comp, scaled to the screen size
    function place(comp, element, fx, fy, rel, opacity) {
        var layer = comp.layers.add(element);
        layer.collapseTransformation = true;
        var sc = (Math.min(comp.width, comp.height) / 1080) * 100 * rel;
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([comp.width * fx, comp.height * fy]);
        t.property("ADBE Scale").setValue([sc, sc]);
        if (opacity !== undefined) t.property("ADBE Opacity").setValue(opacity);
        return layer;
    }

    // ---------------------- studio screens ----------------------
    // One comp per physical LED screen. Mirrored variants keep
    // same-size screens from looking identical while sharing the
    // exact same visual language.
    function makeScreenComp(name, w, h, mirrored) {
        var comp = proj.items.addComp(name, w, h, 1, DUR, FPS);
        comp.parentFolder = masterFolder;
        comp.bgColor = COLORS.dark;

        function fx(f) { return mirrored ? 1 - f : f; }
        var mn = Math.min(w, h);
        var beamRot = mirrored ? -22 : 22;
        var isTicker = (w / h) >= 4;

        var bg = comp.layers.addSolid(COLORS.dark, "Background", w, h, 1, DUR);
        bg.moveToEnd();

        // depth: two soft glows in opposite corners
        addGlow(comp, [w * fx(0.82), h * 0.18], mn * 0.9, COLORS.red, 14);
        addGlow(comp, [w * fx(0.12), h * 0.88], mn * 0.7, COLORS.magenta, 10);

        if (isTicker) {
            // Ultra-wide strip: drifting row of small accents + sweep
            var picks = [elements.chevrons, elements.tick, elements.ring,
                         elements.hairlines, elements.chevrons, elements.tick];
            var n = Math.max(5, Math.round(w / (h * 2.2)));
            for (var i = 0; i < n; i++) {
                var el = picks[i % picks.length];
                var layer = comp.layers.add(el);
                layer.collapseTransformation = true;
                var sc = (h * 0.72) / el.height * 100;
                var t = transformOf(layer);
                t.property("ADBE Position").setValue([w * (i + 0.5) / n, h * 0.5]);
                t.property("ADBE Scale").setValue([sc, sc]);
                t.property("ADBE Position").expression = DRIFT_EXPR;
            }
            addSweep(comp);
            return comp;
        }

        // --- signature diagonal beam cluster (right side, or left if mirrored)
        addBeam(comp, w * fx(0.80), beamRot, mn * 0.30, COLORS.red,     30, 120, 0);    // wide soft wash
        addBeam(comp, w * fx(0.79), beamRot, mn * 0.15, COLORS.red,     75, 0,   0.7);  // main slash
        addBeam(comp, w * fx(0.88), beamRot, mn * 0.06, COLORS.magenta, 80, 0,   1.5);  // secondary
        addBeam(comp, w * fx(0.94), beamRot, mn * 0.018, COLORS.white,  55, 0,   2.3);  // fine highlight
        addBeam(comp, w * fx(0.10), beamRot, mn * 0.02, COLORS.magenta, 35, 6,   3.1);  // echo far side

        // --- accents arranged like the reference mock-up
        place(comp, elements.dotGrid,   fx(0.20), 0.24, 1.00, 80);
        place(comp, elements.hairlines, fx(0.17), 0.48, 1.00, 70);
        place(comp, elements.chevrons,  fx(0.27), 0.68, 0.90);
        place(comp, elements.ring,      fx(0.55), 0.30, 0.90, 45);
        place(comp, elements.tick,      fx(0.46), 0.12, 0.90);
        place(comp, elements.tick,      fx(0.62), 0.78, 0.70);

        // --- neon floor line + light sweep on top
        addFloorLine(comp, 0.92);
        addSweep(comp);

        return comp;
    }

    // Exact physical screen sizes from the studio plan
    makeScreenComp("BackWall_Main_3200x1200", 3200, 1200, false);
    makeScreenComp("BackWall_Side_2800x1200", 2800, 1200, true);
    makeScreenComp("Side_A_1600x1200",        1600, 1200, false);
    makeScreenComp("Side_B_1600x1200",        1600, 1200, true);
    makeScreenComp("Vertical_800x1600",        800, 1600, false);
    makeScreenComp("Square_1600x1600",        1600, 1600, true);
    makeScreenComp("Ticker_2880x270",         2880,  270, false);

    app.endUndoGroup();

    alert("Done!\n\n7 studio screen comps + 5 reusable accents were created.\n\nOpen '01 - Studio Screens' and press Space to preview.\nAll comps loop seamlessly every " + DUR + " seconds.\nRemember to save the project (Ctrl/Cmd+S).");

})();
