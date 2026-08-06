/**
 * Geometric Parallax Loop — After Effects project builder
 * ------------------------------------------------------
 * Builds a 4K, 60-second seamless loop:
 *   bold abstract geometry (deep blue / crimson / orange gradient panels)
 *   + clean white reeded columns,
 *   drifting steadily to the right across FOUR parallax planes.
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

        // Four depth planes. `travel` MUST be a whole multiple of `tile`,
        // otherwise the loop will not be seamless. Speed = travel / loop, so
        // at a fixed loop length a slower plane necessarily repeats sooner —
        // the four tile widths are kept mutually indivisible so the *combined*
        // image effectively never repeats.
        back:    { tile:  864, travel:  864, outW: 550, bob: 0 },   // ~14 px/s
        midFar:  { tile: 1280, travel: 1280, outW: 400, bob: 5 },   // ~21 px/s
        midNear: { tile: 1536, travel: 1536, outW: 350, bob: 7 },   // ~26 px/s
        front:   { tile: 2048, travel: 2048, outW: 300, bob: 10 },  // ~34 px/s

        haze: true,         // aerial perspective over the far plane
        grade: true,        // warm light wash + vignette
        grain: true         // very light film grain
    };

    var PALETTE = {
        navyDeep:   "0E2A68",
        navyBase:   "123170",
        navyLit:    "17398A",
        navyRim:    "2A54A8",   // lit top edge of a navy block
        navyBlock:  "16357E",
        navyFloor:  "0B2359",
        haze:       "1B3F8C",
        orangeTop:  "FFA015",
        orangeBot:  "F97C0B",
        orangeEdge: "C9560A",   // the cut edge of an orange slab — its thickness
        orange2Top: "FF9410",
        orange2Bot: "ED5A79",   // hands off to the purple — one orange→pink→purple run
        pinkMid:    "ED5A79",
        pinkTop:    "F0517E",
        pinkBot:    "A9357C",
        purpleBot:  "5E307A",
        redTop:     "E5495B",
        redBot:     "C4364A",
        redRim:     "F2687C",   // lit top edge of the crimson platform
        stone:      "EFE9DC",
        stoneLit:   "FFFDF8",
        stoneDim:   "C8C0AE",
        groove:     "A79E8B",
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

    /**
     * Light comes from the upper left throughout, so every shadow falls to the
     * lower right — 135 degrees in After Effects, measured clockwise from 12.
     */
    function shadow(layer, opacity255, distance, softness) {
        var e = layer.property("ADBE Effect Parade").addProperty("ADBE Drop Shadow");
        e.property("ADBE Drop Shadow-0001").setValue(rgb(PALETTE.shadow));
        e.property("ADBE Drop Shadow-0002").setValue(opacity255);  // 0–255
        e.property("ADBE Drop Shadow-0003").setValue(135);
        e.property("ADBE Drop Shadow-0004").setValue(distance);
        e.property("ADBE Drop Shadow-0005").setValue(softness);
        return e;
    }

    /**
     * Two shadows, the way a real object casts them: a tight dark contact
     * shadow that holds the object to its background, and a wide soft ambient
     * one that says how far in front of it the object stands. Applied tight
     * first, so the soft pass spreads from an already-anchored silhouette.
     */
    function shadowPair(layer, contact, ambient) {
        shadow(layer, contact[0], contact[1], contact[2]);
        shadow(layer, ambient[0], ambient[1], ambient[2]);
    }

    function rectPts(x1, y1, x2, y2) {
        return [[x1, y1], [x2, y1], [x2, y2], [x1, y2]];
    }

    function offsetPts(pts, dx, dy) {
        var out = [], i;
        for (i = 0; i < pts.length; i++) { out.push([pts[i][0] + dx, pts[i][1] + dy]); }
        return out;
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

    /**
     * The same silhouette, offset and flat-coloured, drawn *behind* the shape.
     * Offset down-right in a darker tone it reads as the slab's cut thickness;
     * offset up in a lighter tone it reads as a top edge catching the light.
     * Cheap, and it survives the parallax — unlike a baked-in painted edge.
     */
    function edge(comp, name, pts, dx, dy, hex) {
        var l = solid(comp, name, hex);
        mask(l, offsetPts(pts, dx, dy));
        return l;
    }

    // -------------------------------------------------------- REEDED COLUMN
    function buildColumn(folder, name, w, ribs) {
        var H = CFG.height;
        var c = addComp(folder, name, w, H, CFG.loop);

        solid(c, "column base", PALETTE.stone);

        // Each rib is round: dark at both edges, a bright highlight running
        // down its centre. Two ramps per rib — one climbing, one falling.
        var rw = w / ribs, i, x;
        for (i = 0; i < ribs; i++) {
            x = i * rw;

            var a = solid(c, "rib " + (i + 1) + " L", PALETTE.stoneDim,
                rw / 2, H, x + rw / 4, H / 2);
            ramp(a, [0, H / 2], PALETTE.stoneDim, [rw / 2, H / 2], PALETTE.stoneLit);

            var b = solid(c, "rib " + (i + 1) + " R", PALETTE.stoneLit,
                rw / 2, H, x + rw * 0.75, H / 2);
            ramp(b, [0, H / 2], PALETTE.stoneLit, [rw / 2, H / 2], PALETTE.stoneDim);

            var g = solid(c, "groove " + (i + 1), PALETTE.groove, 3, H, x, H / 2);
            g.opacity.setValue(45);
        }

        // vertical falloff over the ribs, so the column darkens toward the floor
        var vshade = solid(c, "vertical shade", PALETTE.white);
        ramp(vshade, [w / 2, 0], PALETTE.white, [w / 2, H], "D8D0BE");
        vshade.blendingMode = BlendingMode.MULTIPLY;
        vshade.opacity.setValue(55);

        // the column turning away from the light at each side
        var el = solid(c, "edge L", PALETTE.shade, Math.round(w * 0.16), H,
            Math.round(w * 0.08), H / 2);
        ramp(el, [0, H / 2], PALETTE.shade, [Math.round(w * 0.16), H / 2], PALETTE.white);
        el.blendingMode = BlendingMode.MULTIPLY;
        el.opacity.setValue(50);

        var er = solid(c, "edge R", PALETTE.shade, Math.round(w * 0.24), H,
            w - Math.round(w * 0.12), H / 2);
        ramp(er, [0, H / 2], PALETTE.white, [Math.round(w * 0.24), H / 2], PALETTE.shade);
        er.blendingMode = BlendingMode.MULTIPLY;
        er.opacity.setValue(75);

        return c;
    }

    // ---------------------------------------------- PLANE 1 · far navy field
    function buildTileBack(folder) {
        var W = CFG.back.tile, H = CFG.height;
        var c = addComp(folder, "TILE 1 • Back (navy field)", W, H, CFG.loop);

        var base = solid(c, "navy field", PALETTE.navyBase);
        ramp(base, [W / 2, 0], PALETTE.navyLit, [W / 2, H], PALETTE.navyDeep);

        // Shadows on the far plane are weak and diffuse: distance reads as
        // less contrast, so these barely separate from the wall.
        var a = rect(c, "navy panel A", 90, 0, 510, 1500, PALETTE.navyLit);
        a.opacity.setValue(92);
        shadow(a, 85, 18, 60);

        var b = rect(c, "navy panel B", 580, 0, 790, 980, PALETTE.navyDeep);
        b.opacity.setValue(85);
        shadow(b, 70, 14, 50);

        var floor = rect(c, "floor band", 0, 1880, W, H, PALETTE.navyFloor);
        floor.opacity.setValue(70);

        return c;
    }

    // ------------------------------------------ PLANE 2 · colour wall panels
    function buildTileMidFar(folder) {
        var W = CFG.midFar.tile, H = CFG.height;
        var c = addComp(folder, "TILE 2 • Mid-far (wall panels)", W, H, CFG.loop);

        var accent = rect(c, "navy accent", 0, 0, 130, 1400, PALETTE.navyLit);
        shadow(accent, 100, 22, 70);

        // stops short of the floor rather than flooding the lower half with
        // magenta — the navy field carries on beneath it, and the panel gets a
        // bottom edge to cast from
        var pink = rect(c, "pink gradient", 160, 780, 760, 1600, PALETTE.pinkTop, PALETTE.pinkBot);
        shadowPair(pink, [110, 12, 22], [85, 36, 100]);

        // starts on the exact colour the orange slab above ends on, so the two
        // read as one continuous orange → pink → purple fall
        rect(c, "purple gradient", 790, 1080, 1120, H, PALETTE.pinkMid, PALETTE.purpleBot);

        // orange slab with a chamfered bottom-right corner, cutting to the pink
        var slabPts = [[160, 0], [760, 0], [760, 780], [520, 1060], [160, 1060]];
        edge(c, "orange slab edge", slabPts, 14, 14, PALETTE.orangeEdge);
        var o1 = poly(c, folder, "orange slab", slabPts, PALETTE.orangeTop, PALETTE.orangeBot);
        shadowPair(o1, [120, 12, 24], [95, 40, 110]);

        // second slab, with a diagonal notch cut from its top-left
        var slab2Pts = [[790, 220], [910, 0], [1120, 0], [1120, 1080], [790, 1080]];
        edge(c, "orange slab 2 edge", slab2Pts, 12, 12, PALETTE.orangeEdge);
        var o2 = poly(c, folder, "orange slab 2", slab2Pts, PALETTE.orange2Top, PALETTE.orange2Bot);
        shadowPair(o2, [115, 10, 20], [90, 34, 95]);

        return c;
    }

    // ------------------------------- PLANE 3 · crimson plinth, nearer the eye
    function buildTileMidNear(folder) {
        var W = CFG.midNear.tile, H = CFG.height;
        var c = addComp(folder, "TILE 3 • Mid-near (plinth)", W, H, CFG.loop);

        // Drops to the floor at both tile edges, so the tile wraps — and so the
        // wall panels behind it reach the bottom of frame in the gaps.
        var pts = [
            [0, H], [420, H], [560, 1520], [1000, 1520],
            [1000, 1760], [1260, 1760], [1380, H], [W, H]
        ];

        // top edges catch the light before the slab itself covers them
        edge(c, "plinth top light", pts, 0, -9, PALETTE.redRim);

        var red = poly(c, folder, "crimson plinth", pts, PALETTE.redTop, PALETTE.redBot);
        shadowPair(red, [140, 14, 26], [110, 46, 120]);

        // lit top edge goes down first, so the block itself covers all but a
        // sliver of it — the same trick as the plinth rim, one layer cheaper
        rect(c, "navy block light", 1040, 1344, 1240, 1360, PALETTE.navyRim);
        var b1 = rect(c, "navy block", 1040, 1350, 1240, 1760, PALETTE.navyBlock);
        shadowPair(b1, [135, 10, 18], [105, 34, 90]);

        rect(c, "navy block 2 light", 640, 1174, 820, 1190, PALETTE.navyRim);
        var b2 = rect(c, "navy block 2", 640, 1180, 820, 1520, PALETTE.navyBlock);
        shadowPair(b2, [130, 10, 18], [100, 30, 80]);

        return c;
    }

    // ------------------------------------------------- PLANE 4 · the columns
    function buildTileFront(folder) {
        var W = CFG.front.tile, H = CFG.height;
        var c = addComp(folder, "TILE 4 • Front (columns)", W, H, CFG.loop);

        var colA = buildColumn(folder, "COL • wide", 210, 7);
        var colB = buildColumn(folder, "COL • narrow", 140, 5);

        // The nearest objects in frame, so the widest, softest ambient shadow —
        // and it falls onto whatever plane happens to be sliding past behind.
        var a = c.layers.add(colA, c.duration);
        a.name = "column A";
        a.position.setValue([405, H / 2]);
        shadowPair(a, [165, 16, 30], [130, 72, 165]);

        var b = c.layers.add(colB, c.duration);
        b.name = "column B";
        b.position.setValue([1320, H / 2]);
        shadowPair(b, [155, 14, 26], [120, 60, 140]);

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
    var tileMidFar = buildTileMidFar(src);
    var tileMidNear = buildTileMidNear(src);
    var tileFront = buildTileFront(src);

    var main = addComp(root, CFG.compName, CFG.width, CFG.height, CFG.loop);

    addPlane(main, tileBack, "PLANE 1 • back · 14 px/s", CFG.back);

    if (CFG.haze) {
        // aerial perspective — the far wall sits behind a little more air
        var haze = solid(main, "ATMOS • depth haze", PALETTE.haze);
        ramp(haze, [CFG.width / 2, 0], "16367E", [CFG.width / 2, CFG.height], "24509E");
        haze.opacity.setValue(12);
    }

    addPlane(main, tileMidFar, "PLANE 2 • mid-far · 21 px/s", CFG.midFar);
    addPlane(main, tileMidNear, "PLANE 3 • mid-near · 26 px/s", CFG.midNear);
    addPlane(main, tileFront, "PLANE 4 • front · 34 px/s", CFG.front);

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
        "Four planes: " +
        Math.round(CFG.back.travel / CFG.loop) + " / " +
        Math.round(CFG.midFar.travel / CFG.loop) + " / " +
        Math.round(CFG.midNear.travel / CFG.loop) + " / " +
        Math.round(CFG.front.travel / CFG.loop) + " px/s.\n\n" +
        "If the motion runs the wrong way, set CFG.dir to " + (-CFG.dir) + " and re-run."
    );

})();
