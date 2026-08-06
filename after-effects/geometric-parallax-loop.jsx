/**
 * Geometric Parallax Loop — After Effects project builder
 * ------------------------------------------------------
 * Builds a 4K, 60-second seamless loop:
 *   bold abstract geometry (deep blue / crimson / orange gradient panels)
 *   + clean white fluted columns,
 *   everything drifting steadily to the right in three parallax planes.
 *
 * HOW TO RUN
 *   After Effects > File > Scripts > Run Script File... > pick this file.
 *   (If nothing happens, enable Preferences > Scripting & Expressions >
 *    "Allow Scripts to Write Files and Access Network".)
 *
 * The whole look is data-driven: edit the CFG / PALETTE / tile geometry
 * blocks below and re-run to regenerate.
 *
 * ExtendScript (ES3) — no let/const, no arrow functions, no trailing commas.
 */

(function buildGeometricParallaxLoop() {

    // ---------------------------------------------------------------- CONFIG
    var CFG = {
        compName: "MAIN • Geometric Parallax Loop",
        width: 3840,
        height: 2160,
        fps: 30,
        loop: 60,            // seconds — the loop length. Change and re-run.

        // Scroll direction: -1 = content moves RIGHT, 1 = content moves LEFT.
        dir: -1,

        // Parallax planes. `travel` MUST be a whole multiple of `tile`,
        // otherwise the loop will not be seamless.
        back:  { tile: 1280, travel: 1280, outW: 400, bob: 0 },   // ~21 px/s
        mid:   { tile: 1920, travel: 1920, outW: 300, bob: 6 },   // ~32 px/s
        front: { tile: 1536, travel: 3072, outW: 350, bob: 11 },  // ~51 px/s

        grade: true,        // warm light wash + vignette
        grain: true         // very light film grain
    };

    var PALETTE = {
        navyDeep:   "0E2A68",
        navyBase:   "123170",
        navyLit:    "17398A",
        navyBlock:  "16357E",
        navyFloor:  "0B2359",
        orangeTop:  "FFA015",
        orangeBot:  "F97C0B",
        orange2Top: "FF9410",
        orange2Bot: "ED5A79",   // hands off to purpleTop — one long orange→pink→purple run
        pinkMid:    "ED5A79",
        pinkTop:    "F0517E",
        pinkBot:    "A9357C",
        purpleTop:  "8B4093",
        purpleBot:  "5E307A",
        redTop:     "E5495B",
        redBot:     "C4364A",
        stone:      "EFE9DC",
        stoneLit:   "FDFBF6",
        stoneDim:   "D6CEBC",
        groove:     "B0A895",
        shade:      "8A8070",
        white:      "FFFFFF",
        shadow:     "07173F"
    };

    // ------------------------------------------------------------- UTILITIES
    function rgb(hex) {
        return [
            parseInt(hex.substr(0, 2), 16) / 255,
            parseInt(hex.substr(2, 2), 16) / 255,
            parseInt(hex.substr(4, 2), 16) / 255
        ];
    }

    function addComp(folder, name, w, h, dur) {
        var c = app.project.items.addComp(name, w, h, 1, dur, CFG.fps);
        c.parentFolder = folder;
        c.bgColor = rgb(PALETTE.navyDeep);
        c.motionBlur = false;
        return c;
    }

    /**
     * A solid sized exactly to the artwork it represents.
     * Keeping solids at their true size is what lets Ramp and Drop Shadow
     * work without masks — effects render inside the layer bounds only.
     */
    function solid(comp, name, hex, w, h, cx, cy) {
        var l = comp.layers.addSolid(rgb(hex), name,
            w || comp.width, h || comp.height, 1, comp.duration);
        l.startTime = 0;
        if (cx !== undefined) { l.position.setValue([cx, cy]); }
        return l;
    }

    /** Polygon mask, in layer coordinates (0,0 = top-left of the layer). */
    function mask(layer, pts, feather) {
        var m = layer.property("ADBE Mask Parade").addProperty("ADBE Mask Atom");
        var s = new Shape();
        s.vertices = pts;
        s.closed = true;
        m.property("ADBE Mask Shape").setValue(s);
        if (feather) { m.property("ADBE Mask Feather").setValue([feather, feather]); }
        return m;
    }

    function rectPts(x1, y1, x2, y2) {
        return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    }

    /** Linear gradient. p1 / p2 are points in layer space. */
    function ramp(layer, p1, hexA, p2, hexB) {
        var e = layer.property("ADBE Effect Parade").addProperty("ADBE Ramp");
        e.property("ADBE Ramp-0001").setValue(p1);
        e.property("ADBE Ramp-0002").setValue(rgb(hexA));
        e.property("ADBE Ramp-0003").setValue(p2);
        e.property("ADBE Ramp-0004").setValue(rgb(hexB));
        e.property("ADBE Ramp-0005").setValue(1);   // 1 = linear
        return e;
    }

    function shadow(layer, opacity255, direction, distance, softness) {
        var e = layer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
        e.property("ADBE Drop Shadow-0001").setValue(rgb(PALETTE.shadow));
        e.property("ADBE Drop Shadow-0002").setValue(opacity255);  // 0–255
        e.property("ADBE Drop Shadow-0003").setValue(direction);   // degrees
        e.property("ADBE Drop Shadow-0004").setValue(distance);
        e.property("ADBE Drop Shadow-0005").setValue(softness);
        return e;
    }

    /** Rectangular panel, optionally with a top-to-bottom gradient. */
    function rect(comp, name, x1, y1, x2, y2, hexTop, hexBot) {
        var w = x2 - x1, h = y2 - y1;
        var l = solid(comp, name, hexTop, w, h, x1 + w / 2, y1 + h / 2);
        if (hexBot) { ramp(l, [w / 2, 0], hexTop, [w / 2, h], hexBot); }
        return l;
    }

    /**
     * Non-rectangular panel. The gradient lives inside its own precomp so the
     * polygon mask (applied on the instance) survives — masks render before
     * effects, so a Ramp applied next to a mask would flood the whole layer.
     */
    function poly(comp, folder, name, pts, hexTop, hexBot) {
        var i, minY = pts[0][1], maxY = pts[0][1];
        for (i = 1; i < pts.length; i++) {
            if (pts[i][1] < minY) { minY = pts[i][1]; }
            if (pts[i][1] > maxY) { maxY = pts[i][1]; }
        }

        var l;
        if (hexBot) {
            var g = addComp(folder, "GRAD • " + name, comp.width, comp.height, comp.duration);
            var fill = solid(g, "gradient", hexTop);
            ramp(fill, [g.width / 2, minY], hexTop, [g.width / 2, maxY], hexBot);

            l = comp.layers.add(g, comp.duration);
            l.name = name;
        } else {
            l = solid(comp, name, hexTop);
        }
        mask(l, pts);
        return l;
    }

    // -------------------------------------------------------- FLUTED COLUMN
    function buildColumn(folder, name, w, flutes) {
        var H = CFG.height;
        var c = addComp(folder, name, w, H, CFG.loop);

        // shading pass, front to back (last added sits on top)
        var base = solid(c, "column base", PALETTE.stone);
        ramp(base, [w / 2, 0], PALETTE.stoneLit, [w / 2, H], PALETTE.stoneDim);

        var fw = w / flutes, i, x;
        for (i = 0; i < flutes; i++) {
            x = i * fw;

            // one flute: dark on its left edge, brightening across its face
            var f = solid(c, "flute " + (i + 1), PALETTE.stoneDim, fw, H, x + fw / 2, H / 2);
            ramp(f, [0, H / 2], PALETTE.stoneDim, [fw * 0.78, H / 2], PALETTE.stoneLit);
            f.opacity.setValue(90);

            // the groove between flutes
            var g = solid(c, "groove " + (i + 1), PALETTE.groove, 4, H, x, H / 2);
            g.opacity.setValue(34);
        }

        // rounded-edge shading: a multiply gradient that fades to white (= no-op)
        var el = solid(c, "edge L", PALETTE.shade, Math.round(w * 0.18), H,
            Math.round(w * 0.09), H / 2);
        ramp(el, [0, H / 2], PALETTE.shade, [Math.round(w * 0.18), H / 2], PALETTE.white);
        el.blendingMode = BlendingMode.MULTIPLY;
        el.opacity.setValue(55);

        var er = solid(c, "edge R", PALETTE.shade, Math.round(w * 0.22), H,
            w - Math.round(w * 0.11), H / 2);
        ramp(er, [0, H / 2], PALETTE.white, [Math.round(w * 0.22), H / 2], PALETTE.shade);
        er.blendingMode = BlendingMode.MULTIPLY;
        er.opacity.setValue(72);

        return c;
    }

    // ----------------------------------------------------------- TILE: BACK
    // Nothing crosses x = 0 or x = tile, so the tile edge is invisible.
    function buildTileBack(folder) {
        var W = CFG.back.tile, H = CFG.height;
        var c = addComp(folder, "TILE • Back (navy field)", W, H, CFG.loop);

        var base = solid(c, "navy field", PALETTE.navyBase);
        ramp(base, [W / 2, 0], PALETTE.navyLit, [W / 2, H], PALETTE.navyDeep);

        var a = rect(c, "navy panel A", 140, 0, 760, 1500, PALETTE.navyLit);
        a.opacity.setValue(92);
        shadow(a, 110, 135, 26, 70);

        var b = rect(c, "navy panel B", 860, 0, 1180, 980, PALETTE.navyDeep);
        b.opacity.setValue(85);

        // full-width floor band — identical at both tile edges, so it wraps
        var floor = rect(c, "floor band", 0, 1880, W, H, PALETTE.navyFloor);
        floor.opacity.setValue(70);

        return c;
    }

    // ------------------------------------------------------------ TILE: MID
    function buildTileMid(folder) {
        var W = CFG.mid.tile, H = CFG.height;
        var c = addComp(folder, "TILE • Mid (colour blocks)", W, H, CFG.loop);

        // --- back to front ---
        var navyPanel = rect(c, "navy accent", 1440, 0, 1860, 1240, PALETTE.navyLit);
        shadow(navyPanel, 120, 135, 30, 80);

        rect(c, "pink gradient", 300, 780, 980, H, PALETTE.pinkTop, PALETTE.pinkBot);

        // starts on the exact colour the orange slab above ends on, so the two
        // read as one continuous orange → pink → purple fall
        rect(c, "purple gradient", 1000, 1080, 1380, H, PALETTE.pinkMid, PALETTE.purpleBot);

        // orange slab with a chamfered bottom-right corner, cutting to the pink
        var o1 = poly(c, folder, "orange slab",
            [[300, 0], [980, 0], [980, 780], [700, 1060], [300, 1060]],
            PALETTE.orangeTop, PALETTE.orangeBot);
        shadow(o1, 130, 135, 34, 90);

        // second orange slab, with a diagonal notch cut from its top-left
        var o2 = poly(c, folder, "orange slab 2",
            [[1000, 220], [1140, 0], [1380, 0], [1380, 1080], [1000, 1080]],
            PALETTE.orange2Top, PALETTE.orange2Bot);
        shadow(o2, 120, 135, 30, 80);

        // crimson stepped platform. It drops to the floor at both tile edges,
        // so the tile wraps — and so the pink and purple panels reach the
        // bottom of frame in the gaps, the way they do in the reference.
        var red = poly(c, folder, "crimson platform", [
            [0, H], [620, H], [760, 1520], [1200, 1520],
            [1200, 1760], [1560, 1760], [1700, H], [W, H]
        ], PALETTE.redTop, PALETTE.redBot);
        shadow(red, 140, 135, 26, 60);

        var blue = rect(c, "blue block", 1240, 1150, 1500, 1600, PALETTE.navyBlock);
        shadow(blue, 130, 135, 24, 55);

        // tall stripe keeping the right half of the tile from reading empty,
        // split in two so the orange → pink → purple fall stays smooth
        var s1 = rect(c, "stripe upper", 1560, 0, 1740, 1180, PALETTE.orangeTop, PALETTE.pinkMid);
        shadow(s1, 120, 135, 26, 70);
        rect(c, "stripe lower", 1560, 1180, 1740, H, PALETTE.pinkMid, PALETTE.purpleBot);

        return c;
    }

    // ---------------------------------------------------------- TILE: FRONT
    function buildTileFront(folder) {
        var W = CFG.front.tile, H = CFG.height;
        var c = addComp(folder, "TILE • Front (columns)", W, H, CFG.loop);

        var colA = buildColumn(folder, "COL • wide", 210, 7);
        var colB = buildColumn(folder, "COL • narrow", 140, 5);

        var a = c.layers.add(colA, c.duration);
        a.name = "column A";
        a.position.setValue([365, H / 2]);      // spans 260 .. 470
        shadow(a, 150, 135, 46, 90);

        var b = c.layers.add(colB, c.duration);
        b.name = "column B";
        b.position.setValue([1080, H / 2]);     // spans 1010 .. 1150
        shadow(b, 140, 135, 38, 80);

        return c;
    }

    // ------------------------------------------------------ PARALLAX PLANE
    function addPlane(comp, tileComp, name, plane) {
        var l = comp.layers.add(tileComp, comp.duration);
        l.name = name;
        l.position.setValue([comp.width / 2, comp.height / 2]);

        var e = l.property("ADBE Effect Parade").addProperty("ADBE Tile");
        e.property("ADBE Tile-0004").setValue(plane.outW);   // output width %
        e.property("ADBE Tile-0005").setValue(115);          // output height %
        e.property("ADBE Tile-0006").setValue(0);            // mirror edges off

        // Steady linear drift. The modulo keeps the offset inside a single
        // tile — invisible, because Motion Tile repeats the pattern exactly
        // every TILE pixels. That is what makes the loop frame-exact.
        e.property("ADBE Tile-0001").expression =
            "// steady parallax scroll — loops exactly every LOOP seconds\n" +
            "var LOOP = " + CFG.loop + ";\n" +
            "var TILE = " + plane.tile + ";\n" +
            "var TRAVEL = " + plane.travel + ";   // must be a whole multiple of TILE\n" +
            "var DIR = " + CFG.dir + ";           // flip to " + (-CFG.dir) + " to reverse\n" +
            "var s = ((time / LOOP) * TRAVEL) % TILE;\n" +
            "[value[0] + DIR * s, value[1]]";

        if (plane.bob) {
            l.position.expression =
                "// gentle vertical breathing, one full cycle per loop\n" +
                "var LOOP = " + CFG.loop + ";\n" +
                "var AMP = " + plane.bob + ";\n" +
                "[value[0], value[1] + AMP * Math.sin(time / LOOP * Math.PI * 2)]";
        }

        return l;
    }

    // ----------------------------------------------------------------- RUN
    app.beginUndoGroup("Build Geometric Parallax Loop");

    if (!app.project) { app.newProject(); }

    var root = app.project.items.addFolder("Geometric Parallax Loop");
    var src = app.project.items.addFolder("01 · source tiles");
    src.parentFolder = root;

    var tileBack = buildTileBack(src);
    var tileMid = buildTileMid(src);
    var tileFront = buildTileFront(src);

    var main = addComp(root, CFG.compName, CFG.width, CFG.height, CFG.loop);

    addPlane(main, tileBack, "PLANE 1 • back", CFG.back);
    addPlane(main, tileMid, "PLANE 2 • mid", CFG.mid);
    addPlane(main, tileFront, "PLANE 3 • front", CFG.front);

    if (CFG.grade) {
        var wash = solid(main, "GRADE • warm light", "FFA53A");
        ramp(wash, [CFG.width / 2, 0], "FFA53A", [CFG.width / 2, CFG.height], "6A2E8A");
        wash.blendingMode = BlendingMode.SOFT_LIGHT;
        wash.opacity.setValue(16);

        // oversized solid so the feathered falloff never hits the layer edge
        var pad = 700;
        var vig = solid(main, "GRADE • vignette", "000000",
            CFG.width + pad * 2, CFG.height + pad * 2, CFG.width / 2, CFG.height / 2);
        var vm = mask(vig, rectPts(pad + 260, pad + 260,
            pad + CFG.width - 260, pad + CFG.height - 260), 560);
        vm.inverted = true;
        vig.blendingMode = BlendingMode.MULTIPLY;
        vig.opacity.setValue(30);
    }

    if (CFG.grain) {
        var grain = solid(main, "GRAIN", "808080");
        var n = grain.property("ADBE Effect Parade").addProperty("ADBE Noise");
        n.property("ADBE Noise-0001").setValue(18);
        grain.blendingMode = BlendingMode.OVERLAY;
        grain.opacity.setValue(11);
    }

    main.openInViewer();

    app.endUndoGroup();

    alert(
        "Geometric Parallax Loop built.\n\n" +
        "Comp: " + CFG.compName + "\n" +
        CFG.width + " x " + CFG.height + "  ·  " + CFG.fps + " fps  ·  " +
        CFG.loop + "s seamless loop\n\n" +
        "Parallax: back " + Math.round(CFG.back.travel / CFG.loop) + " px/s, " +
        "mid " + Math.round(CFG.mid.travel / CFG.loop) + " px/s, " +
        "front " + Math.round(CFG.front.travel / CFG.loop) + " px/s.\n\n" +
        "If the motion runs the wrong way, set CFG.dir to " + (-CFG.dir) + " and re-run."
    );

})();
