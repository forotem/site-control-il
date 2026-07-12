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
//    03 - Textures       : auto-imported from a ./textures folder
//                          next to this script (optional)
//
//  DESIGN LANGUAGE (matched to the studio reference frame):
//    near-black graphite wall, layered dark diagonal panels with
//    lit edges, one dominant magenta beam with a hot glowing core,
//    fine dot-matrix panel, diagonal hatch-line block, neon edge
//    frame, grey chevrons + plus ticks + hairlines, double neon
//    floor line (cool white + magenta) with a running highlight,
//    a thin circle on the floor, and a soft light sweep.
//  All motion is slow and subtle; every 10s comp loops seamlessly.
// ============================================================

(function buildStudioScreensProject() {

    app.beginUndoGroup("Build Studio Screens Project");

    // ------------------------- settings -------------------------
    var FPS = 30;
    var DUR = 10;          // seconds - keep frequencies loop-friendly
    var TWO_PI = "Math.PI*2";

    // Palette sampled from the reference frame.
    // Change these and re-run to restyle every screen at once.
    var COLORS = {
        magenta: [0.95, 0.15, 0.50],   // dominant beam / floor line
        red:     [0.90, 0.08, 0.25],   // deep accents
        blue:    [0.60, 0.80, 1.00],   // cool neon floor line
        white:   [0.96, 0.96, 1.00],
        grey:    [0.58, 0.61, 0.68],   // chevrons, ticks, hairlines
        panelA:  [0.085, 0.095, 0.125],// dark slab
        panelB:  [0.115, 0.125, 0.160],// lighter slab
        dark:    [0.035, 0.040, 0.055] // wall
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

    // Thin grey chevron trail ">>>>>" with running-light opacity
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

    // Dark diagonal slab with a subtly lit right edge (set-piece panel)
    function addPanel(comp, xFrac, rot, width, color, phase) {
        var len = (comp.width + comp.height) * 1.6;
        var layer = comp.layers.addShape();
        layer.name = "Panel";
        addShapeGroup(layer, { shape: "rect", size: [width, len], fill: color });
        addShapeGroup(layer, {                       // lit edge
            shape: "rect", size: [3, len], fill: COLORS.white, fillOpacity: 16,
            groupPosition: [width / 2, 0]
        });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([comp.width * xFrac, comp.height / 2]);
        t.property("ADBE Rotate Z").setValue(rot);
        applySway(layer, 4, phase);                  // barely moving - set piece
        return layer;
    }

    // Diagonal light beam; hot=true adds a glowing core near the top
    // (approximates the reference's bright-to-dark gradient beam)
    function addBeam(comp, xFrac, rot, width, color, opacity, blur, phase, hot) {
        var len = (comp.width + comp.height) * 1.6;
        var x = comp.width * xFrac;
        var layer = comp.layers.addShape();
        layer.name = "Beam";
        addShapeGroup(layer, { shape: "rect", size: [width, len], fill: color });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([x, comp.height / 2]);
        t.property("ADBE Rotate Z").setValue(rot);
        t.property("ADBE Opacity").setValue(opacity);
        if (blur) addBlur(layer, blur);
        applySway(layer, 10 + blur * 0.08, phase);

        if (hot) {
            var d = comp.height * 0.32;              // offset up along the beam axis
            var rad = rot * Math.PI / 180;
            var core = comp.layers.addShape();
            core.name = "Beam Hot Core";
            addShapeGroup(core, { shape: "rect", size: [width * 0.55, len * 0.35], fill: COLORS.white });
            var ct = transformOf(core);
            ct.property("ADBE Position").setValue([x + Math.sin(rad) * d, comp.height / 2 - Math.cos(rad) * d]);
            ct.property("ADBE Rotate Z").setValue(rot);
            ct.property("ADBE Opacity").setValue(30);
            addBlur(core, 55);
            core.blendingMode = BlendingMode.ADD;
            applySway(core, 10, phase);
        }
        return layer;
    }

    // Double neon floor line: magenta above, cool white core below,
    // plus a bright runner sliding along it
    function addFloorLines(comp, yFrac) {
        var w = comp.width, y = comp.height * yFrac;

        var mag = comp.layers.addShape();
        mag.name = "Floor Line Magenta";
        addShapeGroup(mag, { shape: "rect", size: [w * 1.1, 4], fill: COLORS.magenta });
        transformOf(mag).property("ADBE Position").setValue([w / 2, y - comp.height * 0.02]);
        addBlur(mag, 8);
        applyBreath(mag, 70, 18, 0.2);

        var glow = comp.layers.addShape();
        glow.name = "Floor Line Glow";
        addShapeGroup(glow, { shape: "rect", size: [w * 1.1, 9], fill: COLORS.blue });
        transformOf(glow).property("ADBE Position").setValue([w / 2, y]);
        addBlur(glow, 22);
        applyBreath(glow, 50, 15, 0.3);

        var core = comp.layers.addShape();
        core.name = "Floor Line Core";
        addShapeGroup(core, { shape: "rect", size: [w * 1.1, 3.5], fill: COLORS.white });
        transformOf(core).property("ADBE Position").setValue([w / 2, y]);
        transformOf(core).property("ADBE Opacity").setValue(88);

        var runner = comp.layers.addShape();
        runner.name = "Floor Runner";
        addShapeGroup(runner, { shape: "rect", size: [comp.height * 0.30, 5], roundness: 3, fill: COLORS.white });
        transformOf(runner).property("ADBE Position").setValue([0, y]);
        addBlur(runner, 8);
        runner.blendingMode = BlendingMode.ADD;
        transformOf(runner).property("ADBE Position").expression = DRIFT_EXPR;
    }

    // Thin circle lying on the floor (like the ring around the candle)
    function addFloorEllipse(comp, xFrac, yFrac, size) {
        var layer = comp.layers.addShape();
        layer.name = "Floor Circle";
        addShapeGroup(layer, {
            shape: "ellipse", size: [size, size * 0.28],
            strokeColor: COLORS.red, strokeWidth: 3
        });
        transformOf(layer).property("ADBE Position").setValue([comp.width * xFrac, comp.height * yFrac]);
        applyBreath(layer, 40, 14, 0.2);
        return layer;
    }

    // Soft light streak that sweeps across once per loop
    function addSweep(comp) {
        var layer = comp.layers.addShape();
        layer.name = "Light Sweep";
        var len = (comp.width + comp.height) * 1.6;
        addShapeGroup(layer, { shape: "rect", size: [comp.height * 0.22, len], fill: COLORS.white });
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([0, comp.height / 2]);
        t.property("ADBE Rotate Z").setValue(14);
        t.property("ADBE Opacity").setValue(9);
        addBlur(layer, 90);
        t.property("ADBE Position").expression =
            "m = 700;\n" +
            "p = (time % " + DUR + ") / " + DUR + ";\n" +
            "[-m + p * (thisComp.width + 2*m), value[1]]";
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

    // Place a reusable element comp, scaled to the screen size
    function place(comp, element, fx, fy, rel, opacity, rotation) {
        var layer = comp.layers.add(element);
        layer.collapseTransformation = true;
        var sc = (Math.min(comp.width, comp.height) / 1080) * 100 * rel;
        var t = transformOf(layer);
        t.property("ADBE Position").setValue([comp.width * fx, comp.height * fy]);
        t.property("ADBE Scale").setValue([sc, sc]);
        if (opacity !== undefined) t.property("ADBE Opacity").setValue(opacity);
        if (rotation) t.property("ADBE Rotate Z").setValue(rotation);
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
        var rot = mirrored ? -22 : 22;
        var isTicker = (w / h) >= 4;

        var bg = comp.layers.addSolid(COLORS.dark, "Background", w, h, 1, DUR);
        bg.moveToEnd();

        // faint center light on the wall + warm corner reflection
        addGlow(comp, [w * 0.5, h * 0.35], mn * 1.1, [0.16, 0.17, 0.21], 55);
        addGlow(comp, [w * fx(0.85), h * 0.95], mn * 0.55, COLORS.magenta, 12);

        if (isTicker) {
            // Ultra-wide strip: drifting row of small accents + sweep
            var picks = [elements.chevrons, elements.tick, elements.hairlines,
                         elements.ring, elements.chevrons, elements.tick];
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
            addFloorLines(comp, 0.86);
            addSweep(comp);
            addGrain(comp);
            return comp;
        }

        // --- layered dark slabs (set-piece depth, right side)
        addPanel(comp, fx(0.99), rot, mn * 0.55, COLORS.panelA, 0.4);
        addPanel(comp, fx(0.84), rot, mn * 0.34, COLORS.panelB, 1.1);
        addPanel(comp, fx(0.70), rot, mn * 0.10, COLORS.panelA, 1.9);

        // --- the dominant magenta beam with hot core + supporting lines
        addBeam(comp, fx(0.80), rot, mn * 0.11, COLORS.magenta, 88, 0, 0.6, true);
        addBeam(comp, fx(0.80), rot, mn * 0.26, COLORS.magenta, 16, 110, 0.6, false); // soft wash
        addBeam(comp, fx(0.91), rot, mn * 0.028, COLORS.red,    60, 0, 1.4, false);
        addBeam(comp, fx(0.735), rot, mn * 0.004, COLORS.white, 30, 0, 2.2, false);   // hairline edge
        addBeam(comp, fx(0.965), rot, mn * 0.004, COLORS.white, 22, 0, 3.0, false);   // hairline edge

        // --- neon edge frame on the opposite side (like top-left of reference)
        addBeam(comp, fx(0.030), rot, mn * 0.006, COLORS.magenta, 85, 3, 0.2, false);
        addBeam(comp, fx(0.065), rot, mn * 0.003, COLORS.blue,    50, 2, 0.9, false);

        // --- accents arranged like the reference
        place(comp, elements.dotGrid,   fx(0.235), 0.26, 1.55, 65);          // big fine dot panel
        place(comp, elements.dotGrid,   fx(0.615), 0.13, 0.65, 35);          // faint secondary dots
        place(comp, elements.hatch,     fx(0.775), 0.66, 1.00, 60, rot);     // striped patch under beam
        place(comp, elements.hairlines, fx(0.615), 0.33, 0.90, 65);
        place(comp, elements.chevrons,  fx(0.115), 0.42, 0.55, 75);
        place(comp, elements.chevrons,  fx(0.665), 0.55, 0.45, 55);
        place(comp, elements.tick,      fx(0.045), 0.58, 0.80);
        place(comp, elements.tick,      fx(0.305), 0.64, 0.60);
        place(comp, elements.tick,      fx(0.875), 0.16, 0.70);

        // --- floor: double neon line, runner, thin circle, sweep on top
        addFloorLines(comp, 0.90);
        addFloorEllipse(comp, fx(0.78), 0.965, mn * 0.42);
        addSweep(comp);
        addGrain(comp);

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

    alert("Done!\n\n7 studio screen comps + 6 reusable accents were created." + texNote +
          "\n\nOpen '01 - Studio Screens' and press Space to preview.\nAll comps loop seamlessly every " + DUR + " seconds.\nRemember to save the project (Ctrl/Cmd+S).");

})();
