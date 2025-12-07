(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/components/ui/modal.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Modal",
    ()=>Modal
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react-dom/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function Modal({ isOpen, onClose, children }) {
    _s();
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Modal.useEffect": ()=>setMounted(true)
    }["Modal.useEffect"], []);
    if (!isOpen || !mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2d$dom$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createPortal"])(/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "w-full max-w-lg rounded-xl border border-border bg-card p-6 shadow-lg relative max-h-[90vh] overflow-y-auto",
            children: [
                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                    onClick: onClose,
                    className: "absolute right-4 top-4 text-muted-foreground hover:text-foreground",
                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__X$3e$__["X"], {
                        className: "h-4 w-4"
                    }, void 0, false, {
                        fileName: "[project]/components/ui/modal.tsx",
                        lineNumber: 18,
                        columnNumber: 21
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/components/ui/modal.tsx",
                    lineNumber: 17,
                    columnNumber: 17
                }, this),
                children
            ]
        }, void 0, true, {
            fileName: "[project]/components/ui/modal.tsx",
            lineNumber: 16,
            columnNumber: 13
        }, this)
    }, void 0, false, {
        fileName: "[project]/components/ui/modal.tsx",
        lineNumber: 15,
        columnNumber: 9
    }, this), document.body);
}
_s(Modal, "LrrVfNW3d1raFE0BNzCTILYmIfo=");
_c = Modal;
var _c;
__turbopack_context__.k.register(_c, "Modal");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:62199f [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"604796a50909e872936bfd6bbb40d57ae4f12bf07f":"updateNote"},"app/actions/note-actions.ts",""] */ __turbopack_context__.s([
    "updateNote",
    ()=>updateNote
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var updateNote = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("604796a50909e872936bfd6bbb40d57ae4f12bf07f", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateNote"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90ZS1hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xuXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcbmltcG9ydCB7IGhlYWRlcnMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyBnZXREYiB9IGZyb20gXCJAL2xpYi9kYlwiO1xuaW1wb3J0IHsgbm90ZXMsIHNlY3Rpb25zLCBub3RlVGFncyB9IGZyb20gXCJAL2RiL3NjaGVtYVwiO1xuaW1wb3J0IHsgZXEsIGRlc2MsIGFuZCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBhdXRoLmFwaS5nZXRTZXNzaW9uKHtcbiAgICAgICAgaGVhZGVyczogYXdhaXQgaGVhZGVycygpXG4gICAgfSk7XG4gICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XG4gICAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5vdGVzKCkge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKCk7XG4gICAgY29uc3QgZGIgPSBnZXREYigpO1xuXG4gICAgLy8gRmV0Y2ggbm90ZXMgZGVzY2VuZGluZyBieSBkYXRlXG4gICAgcmV0dXJuIGF3YWl0IGRiLnNlbGVjdCgpXG4gICAgICAgIC5mcm9tKG5vdGVzKVxuICAgICAgICAud2hlcmUoZXEobm90ZXMudXNlcklkLCB1c2VyLmlkKSlcbiAgICAgICAgLm9yZGVyQnkoZGVzYyhub3Rlcy5kYXRlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZWN0aW9ucygpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIC8vIEZldGNoIHNlY3Rpb25zIG9yIHJldHVybiBkZWZhdWx0cyBpZiBlbXB0eT9cbiAgICAvLyBVc2VyIG1pZ2h0IG5lZWQgdG8gaW5pdCBzZWN0aW9ucy5cbiAgICBjb25zdCB1c2VyU2VjdGlvbnMgPSBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHNlY3Rpb25zKS53aGVyZShlcShzZWN0aW9ucy51c2VySWQsIHVzZXIuaWQpKTtcblxuICAgIGlmICh1c2VyU2VjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEluaXQgZGVmYXVsdCBzZWN0aW9uc1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IFtcIlRyYWRlIE5vdGVzXCIsIFwiRGFpbHkgSm91cm5hbFwiLCBcIlN0cmF0ZWd5XCIsIFwiQmFja3Rlc3RpbmdcIl07XG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBkZWZhdWx0cykge1xuICAgICAgICAgICAgYXdhaXQgZGIuaW5zZXJ0KHNlY3Rpb25zKS52YWx1ZXMoe1xuICAgICAgICAgICAgICAgIGlkOiBgc2VjXyR7RGF0ZS5ub3coKX1fJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSl9YCxcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF3YWl0IGRiLnNlbGVjdCgpLmZyb20oc2VjdGlvbnMpLndoZXJlKGVxKHNlY3Rpb25zLnVzZXJJZCwgdXNlci5pZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB1c2VyU2VjdGlvbnM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVOb3RlKGRhdGE6IE9taXQ8dHlwZW9mIG5vdGVzLiRpbmZlckluc2VydCwgXCJ1c2VySWRcIj4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLmluc2VydChub3RlcykudmFsdWVzKHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgdXNlcklkOiB1c2VyLmlkXG4gICAgfSk7XG5cbiAgICByZXZhbGlkYXRlUGF0aChcIi9ub3RlYm9va1wiKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVOb3RlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8dHlwZW9mIG5vdGVzLiRpbmZlckluc2VydD4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLnVwZGF0ZShub3RlcylcbiAgICAgICAgLnNldCh7IC4uLmRhdGEsIHVwZGF0ZWRBdDogbmV3IERhdGUoKSB9KVxuICAgICAgICAud2hlcmUoYW5kKGVxKG5vdGVzLmlkLCBpZCksIGVxKG5vdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL25vdGVib29rXCIpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU5vdGUoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKCk7XG4gICAgY29uc3QgZGIgPSBnZXREYigpO1xuXG4gICAgYXdhaXQgZGIuZGVsZXRlKG5vdGVzKVxuICAgICAgICAud2hlcmUoYW5kKGVxKG5vdGVzLmlkLCBpZCksIGVxKG5vdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL25vdGVib29rXCIpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiK1JBaUVzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:03f378 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"00399653d60232db485c98282c10c13df2ef2c30f0":"getTemplates"},"app/actions/template-actions.ts",""] */ __turbopack_context__.s([
    "getTemplates",
    ()=>getTemplates
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var getTemplates = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("00399653d60232db485c98282c10c13df2ef2c30f0", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "getTemplates"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVtcGxhdGUtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xuaW1wb3J0IHsgZ2V0RGIgfSBmcm9tIFwiQC9saWIvZGJcIjtcbmltcG9ydCB7IHRlbXBsYXRlcyB9IGZyb20gXCJAL2RiL3NjaGVtYVwiO1xuaW1wb3J0IHsgZXEsIGFuZCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBhdXRoLmFwaS5nZXRTZXNzaW9uKHtcbiAgICAgICAgaGVhZGVyczogYXdhaXQgaGVhZGVycygpXG4gICAgfSk7XG4gICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XG4gICAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRlbXBsYXRlcygpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGNvbnN0IHVzZXJUZW1wbGF0ZXMgPSBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuXG4gICAgaWYgKHVzZXJUZW1wbGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEluaXQgZGVmYXVsdHNcbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiRGFpbHkgUGxhblwiLCBjb250ZW50OiBcIlxcbiMgRGFpbHkgUGxhblxcbi0gWyBdIFJldmlldyBPdmVybmlnaHQgQWN0aW9uXFxuLSBbIF0gQ2hlY2sgRWNvbm9taWMgQ2FsZW5kYXJcXG4tIFsgXSBLZXkgTGV2ZWxzIHRvIFdhdGNoOlxcbiAgLSBFUzogXFxuICAtIE5ROiBcXG5cIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIlRyYWRlIFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgVHJhZGUgUmV2aWV3XFxuLSBTZXR1cDpcXG4tIEV4ZWN1dGlvbjpcXG4tIFBzeWNob2xvZ3k6XFxuLSBPdXRjb21lOlxcbi0gSW1wcm92ZW1lbnRzOlxcblwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiV2Vla2x5IFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgV2Vla2x5IFJldmlld1xcbi0gUCZMOiBcXG4tIEJlc3QgVHJhZGU6XFxuLSBXb3JzdCBUcmFkZTpcXG4tIExlc3NvbnMgTGVhcm5lZDpcXG5cIiB9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGRlZmF1bHRzKSB7XG4gICAgICAgICAgICBhd2FpdCBkYi5pbnNlcnQodGVtcGxhdGVzKS52YWx1ZXMoe1xuICAgICAgICAgICAgICAgIGlkOiBgdG1wbF8ke0RhdGUubm93KCl9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDUpfWAsXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIG5hbWU6IHQubmFtZSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0LmNvbnRlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB1c2VyVGVtcGxhdGVzO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUoZGF0YTogT21pdDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydCwgXCJ1c2VySWRcIj4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLmluc2VydCh0ZW1wbGF0ZXMpLnZhbHVlcyh7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHVzZXJJZDogdXNlci5pZFxuICAgIH0pO1xuICAgIC8vIE5vIHNwZWNpZmljIHBhZ2UgdG8gcmV2YWxpZGF0ZSBmb3IgdGVtcGxhdGVzIHVubGVzcyB3ZSBoYXZlIGEgbWFuYWdlciBwYWdlLiBcbiAgICAvLyBCdXQgRWRpdG9yIHVzZXMgdGhlbS4gXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGVtcGxhdGUoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydD4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLnVwZGF0ZSh0ZW1wbGF0ZXMpXG4gICAgICAgIC5zZXQoeyAuLi5kYXRhLCB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkgfSlcbiAgICAgICAgLndoZXJlKGFuZChlcSh0ZW1wbGF0ZXMuaWQsIGlkKSwgZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUZW1wbGF0ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IGdldFVzZXIoKTtcbiAgICBjb25zdCBkYiA9IGdldERiKCk7XG5cbiAgICBhd2FpdCBkYi5kZWxldGUodGVtcGxhdGVzKS53aGVyZShhbmQoZXEodGVtcGxhdGVzLmlkLCBpZCksIGVxKHRlbXBsYXRlcy51c2VySWQsIHVzZXIuaWQpKSk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJxU0FpQnNCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:08c08d [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"404bf889af309280233c16c7335b847e95e56728ac":"createTemplate"},"app/actions/template-actions.ts",""] */ __turbopack_context__.s([
    "createTemplate",
    ()=>createTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var createTemplate = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("404bf889af309280233c16c7335b847e95e56728ac", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createTemplate"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVtcGxhdGUtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xuaW1wb3J0IHsgZ2V0RGIgfSBmcm9tIFwiQC9saWIvZGJcIjtcbmltcG9ydCB7IHRlbXBsYXRlcyB9IGZyb20gXCJAL2RiL3NjaGVtYVwiO1xuaW1wb3J0IHsgZXEsIGFuZCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBhdXRoLmFwaS5nZXRTZXNzaW9uKHtcbiAgICAgICAgaGVhZGVyczogYXdhaXQgaGVhZGVycygpXG4gICAgfSk7XG4gICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XG4gICAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRlbXBsYXRlcygpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGNvbnN0IHVzZXJUZW1wbGF0ZXMgPSBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuXG4gICAgaWYgKHVzZXJUZW1wbGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEluaXQgZGVmYXVsdHNcbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiRGFpbHkgUGxhblwiLCBjb250ZW50OiBcIlxcbiMgRGFpbHkgUGxhblxcbi0gWyBdIFJldmlldyBPdmVybmlnaHQgQWN0aW9uXFxuLSBbIF0gQ2hlY2sgRWNvbm9taWMgQ2FsZW5kYXJcXG4tIFsgXSBLZXkgTGV2ZWxzIHRvIFdhdGNoOlxcbiAgLSBFUzogXFxuICAtIE5ROiBcXG5cIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIlRyYWRlIFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgVHJhZGUgUmV2aWV3XFxuLSBTZXR1cDpcXG4tIEV4ZWN1dGlvbjpcXG4tIFBzeWNob2xvZ3k6XFxuLSBPdXRjb21lOlxcbi0gSW1wcm92ZW1lbnRzOlxcblwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiV2Vla2x5IFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgV2Vla2x5IFJldmlld1xcbi0gUCZMOiBcXG4tIEJlc3QgVHJhZGU6XFxuLSBXb3JzdCBUcmFkZTpcXG4tIExlc3NvbnMgTGVhcm5lZDpcXG5cIiB9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGRlZmF1bHRzKSB7XG4gICAgICAgICAgICBhd2FpdCBkYi5pbnNlcnQodGVtcGxhdGVzKS52YWx1ZXMoe1xuICAgICAgICAgICAgICAgIGlkOiBgdG1wbF8ke0RhdGUubm93KCl9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDUpfWAsXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIG5hbWU6IHQubmFtZSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0LmNvbnRlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB1c2VyVGVtcGxhdGVzO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUoZGF0YTogT21pdDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydCwgXCJ1c2VySWRcIj4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLmluc2VydCh0ZW1wbGF0ZXMpLnZhbHVlcyh7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHVzZXJJZDogdXNlci5pZFxuICAgIH0pO1xuICAgIC8vIE5vIHNwZWNpZmljIHBhZ2UgdG8gcmV2YWxpZGF0ZSBmb3IgdGVtcGxhdGVzIHVubGVzcyB3ZSBoYXZlIGEgbWFuYWdlciBwYWdlLiBcbiAgICAvLyBCdXQgRWRpdG9yIHVzZXMgdGhlbS4gXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGVtcGxhdGUoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydD4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLnVwZGF0ZSh0ZW1wbGF0ZXMpXG4gICAgICAgIC5zZXQoeyAuLi5kYXRhLCB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkgfSlcbiAgICAgICAgLndoZXJlKGFuZChlcSh0ZW1wbGF0ZXMuaWQsIGlkKSwgZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUZW1wbGF0ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IGdldFVzZXIoKTtcbiAgICBjb25zdCBkYiA9IGdldERiKCk7XG5cbiAgICBhd2FpdCBkYi5kZWxldGUodGVtcGxhdGVzKS53aGVyZShhbmQoZXEodGVtcGxhdGVzLmlkLCBpZCksIGVxKHRlbXBsYXRlcy51c2VySWQsIHVzZXIuaWQpKSk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ1U0E2Q3NCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:27e71a [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"60033033569661b596acdcfd5c74e60d2ed3a00b1a":"updateTemplate"},"app/actions/template-actions.ts",""] */ __turbopack_context__.s([
    "updateTemplate",
    ()=>updateTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var updateTemplate = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("60033033569661b596acdcfd5c74e60d2ed3a00b1a", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "updateTemplate"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVtcGxhdGUtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xuaW1wb3J0IHsgZ2V0RGIgfSBmcm9tIFwiQC9saWIvZGJcIjtcbmltcG9ydCB7IHRlbXBsYXRlcyB9IGZyb20gXCJAL2RiL3NjaGVtYVwiO1xuaW1wb3J0IHsgZXEsIGFuZCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBhdXRoLmFwaS5nZXRTZXNzaW9uKHtcbiAgICAgICAgaGVhZGVyczogYXdhaXQgaGVhZGVycygpXG4gICAgfSk7XG4gICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XG4gICAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRlbXBsYXRlcygpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGNvbnN0IHVzZXJUZW1wbGF0ZXMgPSBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuXG4gICAgaWYgKHVzZXJUZW1wbGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEluaXQgZGVmYXVsdHNcbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiRGFpbHkgUGxhblwiLCBjb250ZW50OiBcIlxcbiMgRGFpbHkgUGxhblxcbi0gWyBdIFJldmlldyBPdmVybmlnaHQgQWN0aW9uXFxuLSBbIF0gQ2hlY2sgRWNvbm9taWMgQ2FsZW5kYXJcXG4tIFsgXSBLZXkgTGV2ZWxzIHRvIFdhdGNoOlxcbiAgLSBFUzogXFxuICAtIE5ROiBcXG5cIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIlRyYWRlIFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgVHJhZGUgUmV2aWV3XFxuLSBTZXR1cDpcXG4tIEV4ZWN1dGlvbjpcXG4tIFBzeWNob2xvZ3k6XFxuLSBPdXRjb21lOlxcbi0gSW1wcm92ZW1lbnRzOlxcblwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiV2Vla2x5IFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgV2Vla2x5IFJldmlld1xcbi0gUCZMOiBcXG4tIEJlc3QgVHJhZGU6XFxuLSBXb3JzdCBUcmFkZTpcXG4tIExlc3NvbnMgTGVhcm5lZDpcXG5cIiB9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGRlZmF1bHRzKSB7XG4gICAgICAgICAgICBhd2FpdCBkYi5pbnNlcnQodGVtcGxhdGVzKS52YWx1ZXMoe1xuICAgICAgICAgICAgICAgIGlkOiBgdG1wbF8ke0RhdGUubm93KCl9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDUpfWAsXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIG5hbWU6IHQubmFtZSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0LmNvbnRlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB1c2VyVGVtcGxhdGVzO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUoZGF0YTogT21pdDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydCwgXCJ1c2VySWRcIj4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLmluc2VydCh0ZW1wbGF0ZXMpLnZhbHVlcyh7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHVzZXJJZDogdXNlci5pZFxuICAgIH0pO1xuICAgIC8vIE5vIHNwZWNpZmljIHBhZ2UgdG8gcmV2YWxpZGF0ZSBmb3IgdGVtcGxhdGVzIHVubGVzcyB3ZSBoYXZlIGEgbWFuYWdlciBwYWdlLiBcbiAgICAvLyBCdXQgRWRpdG9yIHVzZXMgdGhlbS4gXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGVtcGxhdGUoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydD4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLnVwZGF0ZSh0ZW1wbGF0ZXMpXG4gICAgICAgIC5zZXQoeyAuLi5kYXRhLCB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkgfSlcbiAgICAgICAgLndoZXJlKGFuZChlcSh0ZW1wbGF0ZXMuaWQsIGlkKSwgZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUZW1wbGF0ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IGdldFVzZXIoKTtcbiAgICBjb25zdCBkYiA9IGdldERiKCk7XG5cbiAgICBhd2FpdCBkYi5kZWxldGUodGVtcGxhdGVzKS53aGVyZShhbmQoZXEodGVtcGxhdGVzLmlkLCBpZCksIGVxKHRlbXBsYXRlcy51c2VySWQsIHVzZXIuaWQpKSk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ1U0EwRHNCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:dae449 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"404b7a25599fc8344c6847834fa59ac89e5ec11794":"deleteTemplate"},"app/actions/template-actions.ts",""] */ __turbopack_context__.s([
    "deleteTemplate",
    ()=>deleteTemplate
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var deleteTemplate = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("404b7a25599fc8344c6847834fa59ac89e5ec11794", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteTemplate"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vdGVtcGxhdGUtYWN0aW9ucy50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzZXJ2ZXJcIjtcblxuaW1wb3J0IHsgYXV0aCB9IGZyb20gXCJAL2xpYi9hdXRoXCI7XG5pbXBvcnQgeyBoZWFkZXJzIH0gZnJvbSBcIm5leHQvaGVhZGVyc1wiO1xuaW1wb3J0IHsgZ2V0RGIgfSBmcm9tIFwiQC9saWIvZGJcIjtcbmltcG9ydCB7IHRlbXBsYXRlcyB9IGZyb20gXCJAL2RiL3NjaGVtYVwiO1xuaW1wb3J0IHsgZXEsIGFuZCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBhdXRoLmFwaS5nZXRTZXNzaW9uKHtcbiAgICAgICAgaGVhZGVyczogYXdhaXQgaGVhZGVycygpXG4gICAgfSk7XG4gICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XG4gICAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldFRlbXBsYXRlcygpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGNvbnN0IHVzZXJUZW1wbGF0ZXMgPSBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuXG4gICAgaWYgKHVzZXJUZW1wbGF0ZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEluaXQgZGVmYXVsdHNcbiAgICAgICAgY29uc3QgZGVmYXVsdHMgPSBbXG4gICAgICAgICAgICB7IG5hbWU6IFwiRGFpbHkgUGxhblwiLCBjb250ZW50OiBcIlxcbiMgRGFpbHkgUGxhblxcbi0gWyBdIFJldmlldyBPdmVybmlnaHQgQWN0aW9uXFxuLSBbIF0gQ2hlY2sgRWNvbm9taWMgQ2FsZW5kYXJcXG4tIFsgXSBLZXkgTGV2ZWxzIHRvIFdhdGNoOlxcbiAgLSBFUzogXFxuICAtIE5ROiBcXG5cIiB9LFxuICAgICAgICAgICAgeyBuYW1lOiBcIlRyYWRlIFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgVHJhZGUgUmV2aWV3XFxuLSBTZXR1cDpcXG4tIEV4ZWN1dGlvbjpcXG4tIFBzeWNob2xvZ3k6XFxuLSBPdXRjb21lOlxcbi0gSW1wcm92ZW1lbnRzOlxcblwiIH0sXG4gICAgICAgICAgICB7IG5hbWU6IFwiV2Vla2x5IFJldmlld1wiLCBjb250ZW50OiBcIlxcbiMgV2Vla2x5IFJldmlld1xcbi0gUCZMOiBcXG4tIEJlc3QgVHJhZGU6XFxuLSBXb3JzdCBUcmFkZTpcXG4tIExlc3NvbnMgTGVhcm5lZDpcXG5cIiB9XG4gICAgICAgIF07XG5cbiAgICAgICAgZm9yIChjb25zdCB0IG9mIGRlZmF1bHRzKSB7XG4gICAgICAgICAgICBhd2FpdCBkYi5pbnNlcnQodGVtcGxhdGVzKS52YWx1ZXMoe1xuICAgICAgICAgICAgICAgIGlkOiBgdG1wbF8ke0RhdGUubm93KCl9XyR7TWF0aC5yYW5kb20oKS50b1N0cmluZygzNikuc3Vic3RyKDIsIDUpfWAsXG4gICAgICAgICAgICAgICAgdXNlcklkOiB1c2VyLmlkLFxuICAgICAgICAgICAgICAgIG5hbWU6IHQubmFtZSxcbiAgICAgICAgICAgICAgICBjb250ZW50OiB0LmNvbnRlbnRcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHRlbXBsYXRlcykud2hlcmUoZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB1c2VyVGVtcGxhdGVzO1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gY3JlYXRlVGVtcGxhdGUoZGF0YTogT21pdDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydCwgXCJ1c2VySWRcIj4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLmluc2VydCh0ZW1wbGF0ZXMpLnZhbHVlcyh7XG4gICAgICAgIC4uLmRhdGEsXG4gICAgICAgIHVzZXJJZDogdXNlci5pZFxuICAgIH0pO1xuICAgIC8vIE5vIHNwZWNpZmljIHBhZ2UgdG8gcmV2YWxpZGF0ZSBmb3IgdGVtcGxhdGVzIHVubGVzcyB3ZSBoYXZlIGEgbWFuYWdlciBwYWdlLiBcbiAgICAvLyBCdXQgRWRpdG9yIHVzZXMgdGhlbS4gXG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gdXBkYXRlVGVtcGxhdGUoaWQ6IHN0cmluZywgZGF0YTogUGFydGlhbDx0eXBlb2YgdGVtcGxhdGVzLiRpbmZlckluc2VydD4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLnVwZGF0ZSh0ZW1wbGF0ZXMpXG4gICAgICAgIC5zZXQoeyAuLi5kYXRhLCB1cGRhdGVkQXQ6IG5ldyBEYXRlKCkgfSlcbiAgICAgICAgLndoZXJlKGFuZChlcSh0ZW1wbGF0ZXMuaWQsIGlkKSwgZXEodGVtcGxhdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBkZWxldGVUZW1wbGF0ZShpZDogc3RyaW5nKSB7XG4gICAgY29uc3QgdXNlciA9IGF3YWl0IGdldFVzZXIoKTtcbiAgICBjb25zdCBkYiA9IGdldERiKCk7XG5cbiAgICBhd2FpdCBkYi5kZWxldGUodGVtcGxhdGVzKS53aGVyZShhbmQoZXEodGVtcGxhdGVzLmlkLCBpZCksIGVxKHRlbXBsYXRlcy51c2VySWQsIHVzZXIuaWQpKSk7XG4gICAgcmV0dXJuIHsgc3VjY2VzczogdHJ1ZSB9O1xufVxuIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJ1U0FvRXNCIn0=
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/notebook/Editor.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Editor",
    ()=>Editor
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/list.js [app-client] (ecmascript) <export default as List>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/settings.js [app-client] (ecmascript) <export default as Settings>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.js [app-client] (ecmascript) <export default as Trash>");
// import { Note, saveNote, getTemplates, saveTemplates, Template } from "@/lib/storage"; // REMOVED
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/ui/modal.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$62199f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:62199f [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$03f378__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:03f378 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$08c08d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:08c08d [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$27e71a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:27e71a [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$dae449__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:dae449 [app-client] (ecmascript) <text/javascript>");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
function Editor({ selectedNote, onSave }) {
    _s();
    const [content, setContent] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [title, setTitle] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [isSaved, setIsSaved] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showTemplates, setShowTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [templates, setTemplates] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    // Template Manager State
    const [isManageOpen, setIsManageOpen] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [editingTemplate, setEditingTemplate] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    // Fetch templates on mount
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$03f378__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["getTemplates"])().then({
                "Editor.useEffect": (data)=>setTemplates(data)
            }["Editor.useEffect"]);
        }
    }["Editor.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "Editor.useEffect": ()=>{
            if (selectedNote) {
                setTitle(selectedNote.title);
                setContent(selectedNote.content);
                setIsSaved(false);
            } else {
                setTitle("");
                setContent("");
            }
        }
    }["Editor.useEffect"], [
        selectedNote
    ]);
    const handleSave = async ()=>{
        if (!selectedNote) return;
        setIsSaved(true); // Optimistic UI
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$62199f__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateNote"])(selectedNote.id, {
            title,
            content
        });
        onSave(); // Refresh parent list
        setTimeout(()=>setIsSaved(false), 2000);
    };
    const insertTemplate = (templateContent)=>{
        setContent((prev)=>prev + templateContent);
        setShowTemplates(false);
    };
    const saveTemplate = async ()=>{
        if (!editingTemplate) return;
        // Optimistic Update
        let newTemplates = [
            ...templates
        ];
        const existingIndex = newTemplates.findIndex((t)=>t.id === editingTemplate.id);
        if (existingIndex >= 0) {
            newTemplates[existingIndex] = editingTemplate;
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$27e71a__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["updateTemplate"])(editingTemplate.id, {
                name: editingTemplate.name,
                content: editingTemplate.content
            });
        } else {
            newTemplates.push(editingTemplate);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$08c08d__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createTemplate"])({
                id: editingTemplate.id,
                name: editingTemplate.name,
                content: editingTemplate.content
            });
        }
        setTemplates(newTemplates);
        setEditingTemplate(null);
    // Refresh triggers implicit re-fetch if needed, but local state is fine.
    };
    const handleDeleteTemplate = async (id)=>{
        if (confirm("Delete this template?")) {
            const newTemplates = templates.filter((t)=>t.id !== id);
            setTemplates(newTemplates);
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$dae449__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteTemplate"])(id);
            if (editingTemplate?.id === id) setEditingTemplate(null);
        }
    };
    const insertImage = ()=>{
        const url = prompt("Enter Image URL:");
        if (url) {
            setContent((prev)=>prev + `\n<img src="${url}" alt="Image" style="max-width: 100%; border-radius: 8px; margin-top: 10px;" />\n`);
        }
    };
    if (!selectedNote) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            className: "flex h-full items-center justify-center text-muted-foreground",
            children: "Select a page to start writing"
        }, void 0, false, {
            fileName: "[project]/components/notebook/Editor.tsx",
            lineNumber: 111,
            columnNumber: 13
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-full flex-col",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "border-b border-border p-4",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                        type: "text",
                        className: "w-full bg-transparent text-3xl font-bold focus:outline-none",
                        value: title,
                        onChange: (e)=>setTitle(e.target.value),
                        placeholder: "Page Title"
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 120,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "mt-2 flex items-center space-x-2 text-sm text-muted-foreground",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: selectedNote.date
                        }, void 0, false, {
                            fileName: "[project]/components/notebook/Editor.tsx",
                            lineNumber: 128,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 127,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/notebook/Editor.tsx",
                lineNumber: 119,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex items-center border-b border-border bg-muted/20 px-4 py-2 space-x-2 relative",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "relative",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setShowTemplates(!showTemplates),
                                className: "flex items-center space-x-1 px-2 py-1 text-xs bg-background border border-border rounded hover:bg-muted transition-colors",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$list$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__List$3e$__["List"], {
                                        className: "h-3 w-3"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 137,
                                        columnNumber: 25
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Templates"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 138,
                                        columnNumber: 25
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 136,
                                columnNumber: 21
                            }, this),
                            showTemplates && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "absolute top-full left-0 mt-1 w-56 bg-card border border-border shadow-lg rounded-md z-10 py-1 flex flex-col",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "max-h-60 overflow-y-auto",
                                        children: templates.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>insertTemplate(t.content),
                                                className: "block w-full text-left px-4 py-2 text-xs hover:bg-muted truncate",
                                                children: t.name
                                            }, t.id, false, {
                                                fileName: "[project]/components/notebook/Editor.tsx",
                                                lineNumber: 144,
                                                columnNumber: 37
                                            }, this))
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 142,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "border-t border-border mt-1 pt-1",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setIsManageOpen(true);
                                                setShowTemplates(false);
                                            },
                                            className: "w-full text-left px-4 py-2 text-xs hover:bg-muted flex items-center text-muted-foreground",
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                    className: "h-3 w-3 mr-2"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/notebook/Editor.tsx",
                                                    lineNumber: 158,
                                                    columnNumber: 37
                                                }, this),
                                                "Manage Templates"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/components/notebook/Editor.tsx",
                                            lineNumber: 154,
                                            columnNumber: 33
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 153,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 141,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 135,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "h-4 w-[1px] bg-border mx-2"
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 166,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: insertImage,
                        className: "flex items-center space-x-1 px-2 py-1 text-xs bg-background border border-border rounded hover:bg-muted transition-colors",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Tag$3e$__["Tag"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 172,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Add Image"
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 173,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 168,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1"
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 176,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleSave,
                        className: `flex items-center space-x-1 px-3 py-1 text-xs rounded transition-colors ${isSaved ? "bg-green-500/20 text-green-500" : "bg-primary text-primary-foreground hover:bg-primary/90"}`,
                        children: [
                            isSaved ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Check$3e$__["Check"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 182,
                                columnNumber: 32
                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Save$3e$__["Save"], {
                                className: "h-3 w-3"
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 182,
                                columnNumber: 64
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: isSaved ? "Saved" : "Save"
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 183,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 177,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/notebook/Editor.tsx",
                lineNumber: 133,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                className: "flex-1 resize-none bg-transparent p-6 focus:outline-none font-mono text-sm leading-relaxed",
                placeholder: "Start typing...",
                value: content,
                onChange: (e)=>setContent(e.target.value)
            }, void 0, false, {
                fileName: "[project]/components/notebook/Editor.tsx",
                lineNumber: 187,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                className: "px-6 pb-2 text-[10px] text-muted-foreground/50 text-right",
                children: "Markdown & HTML supported"
            }, void 0, false, {
                fileName: "[project]/components/notebook/Editor.tsx",
                lineNumber: 193,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$ui$2f$modal$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Modal"], {
                isOpen: isManageOpen,
                onClose: ()=>{
                    setIsManageOpen(false);
                    setEditingTemplate(null);
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        className: "text-xl font-bold mb-4",
                        children: "Manage Templates"
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 197,
                        columnNumber: 17
                    }, this),
                    editingTemplate ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-medium text-muted-foreground mb-1 block",
                                        children: "Template Name"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 202,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        className: "w-full bg-muted/50 border border-input rounded px-3 py-2 text-sm",
                                        value: editingTemplate.name,
                                        onChange: (e)=>setEditingTemplate({
                                                ...editingTemplate,
                                                name: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 203,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 201,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                        className: "text-xs font-medium text-muted-foreground mb-1 block",
                                        children: "Content"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 210,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("textarea", {
                                        className: "w-full h-40 bg-muted/50 border border-input rounded px-3 py-2 text-sm font-mono",
                                        value: editingTemplate.content,
                                        onChange: (e)=>setEditingTemplate({
                                                ...editingTemplate,
                                                content: e.target.value
                                            })
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 211,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 209,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "flex space-x-2",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: saveTemplate,
                                        className: "flex-1 bg-primary text-primary-foreground hover:bg-primary/90 py-2 rounded text-sm font-medium",
                                        children: "Save Template"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 218,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setEditingTemplate(null),
                                        className: "flex-1 bg-muted text-foreground hover:bg-muted/80 py-2 rounded text-sm font-medium",
                                        children: "Cancel"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 221,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 217,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 200,
                        columnNumber: 21
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "space-y-4",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: "space-y-2",
                                children: templates.map((t)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between p-3 border border-border rounded-lg bg-muted/20",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                className: "text-sm font-medium",
                                                children: t.name
                                            }, void 0, false, {
                                                fileName: "[project]/components/notebook/Editor.tsx",
                                                lineNumber: 231,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                className: "flex space-x-2",
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>setEditingTemplate(t),
                                                        className: "p-1 hover:bg-primary/10 text-primary rounded",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$settings$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Settings$3e$__["Settings"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/notebook/Editor.tsx",
                                                            lineNumber: 234,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notebook/Editor.tsx",
                                                        lineNumber: 233,
                                                        columnNumber: 41
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                        onClick: ()=>handleDeleteTemplate(t.id),
                                                        className: "p-1 hover:bg-destructive/10 text-destructive rounded",
                                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash$3e$__["Trash"], {
                                                            className: "h-4 w-4"
                                                        }, void 0, false, {
                                                            fileName: "[project]/components/notebook/Editor.tsx",
                                                            lineNumber: 237,
                                                            columnNumber: 45
                                                        }, this)
                                                    }, void 0, false, {
                                                        fileName: "[project]/components/notebook/Editor.tsx",
                                                        lineNumber: 236,
                                                        columnNumber: 41
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/components/notebook/Editor.tsx",
                                                lineNumber: 232,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, t.id, true, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 230,
                                        columnNumber: 33
                                    }, this))
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 228,
                                columnNumber: 25
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setEditingTemplate({
                                        id: `t_${Date.now()}`,
                                        name: "New Template",
                                        content: ""
                                    }),
                                className: "w-full flex items-center justify-center space-x-2 border border-dashed border-border py-3 rounded-lg hover:bg-muted/50 transition-colors text-muted-foreground",
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 247,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        children: "Create New Template"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/Editor.tsx",
                                        lineNumber: 248,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/components/notebook/Editor.tsx",
                                lineNumber: 243,
                                columnNumber: 25
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notebook/Editor.tsx",
                        lineNumber: 227,
                        columnNumber: 21
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/notebook/Editor.tsx",
                lineNumber: 196,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/notebook/Editor.tsx",
        lineNumber: 118,
        columnNumber: 9
    }, this);
}
_s(Editor, "QZadTwlhba8/PeaGcuQJAuUiriw=");
_c = Editor;
var _c;
__turbopack_context__.k.register(_c, "Editor");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:f57d91 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"406debee7cf8e0814e52095644e4c8fbd292855462":"createNote"},"app/actions/note-actions.ts",""] */ __turbopack_context__.s([
    "createNote",
    ()=>createNote
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var createNote = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("406debee7cf8e0814e52095644e4c8fbd292855462", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "createNote"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90ZS1hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xuXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcbmltcG9ydCB7IGhlYWRlcnMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyBnZXREYiB9IGZyb20gXCJAL2xpYi9kYlwiO1xuaW1wb3J0IHsgbm90ZXMsIHNlY3Rpb25zLCBub3RlVGFncyB9IGZyb20gXCJAL2RiL3NjaGVtYVwiO1xuaW1wb3J0IHsgZXEsIGRlc2MsIGFuZCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBhdXRoLmFwaS5nZXRTZXNzaW9uKHtcbiAgICAgICAgaGVhZGVyczogYXdhaXQgaGVhZGVycygpXG4gICAgfSk7XG4gICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XG4gICAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5vdGVzKCkge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKCk7XG4gICAgY29uc3QgZGIgPSBnZXREYigpO1xuXG4gICAgLy8gRmV0Y2ggbm90ZXMgZGVzY2VuZGluZyBieSBkYXRlXG4gICAgcmV0dXJuIGF3YWl0IGRiLnNlbGVjdCgpXG4gICAgICAgIC5mcm9tKG5vdGVzKVxuICAgICAgICAud2hlcmUoZXEobm90ZXMudXNlcklkLCB1c2VyLmlkKSlcbiAgICAgICAgLm9yZGVyQnkoZGVzYyhub3Rlcy5kYXRlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZWN0aW9ucygpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIC8vIEZldGNoIHNlY3Rpb25zIG9yIHJldHVybiBkZWZhdWx0cyBpZiBlbXB0eT9cbiAgICAvLyBVc2VyIG1pZ2h0IG5lZWQgdG8gaW5pdCBzZWN0aW9ucy5cbiAgICBjb25zdCB1c2VyU2VjdGlvbnMgPSBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHNlY3Rpb25zKS53aGVyZShlcShzZWN0aW9ucy51c2VySWQsIHVzZXIuaWQpKTtcblxuICAgIGlmICh1c2VyU2VjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEluaXQgZGVmYXVsdCBzZWN0aW9uc1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IFtcIlRyYWRlIE5vdGVzXCIsIFwiRGFpbHkgSm91cm5hbFwiLCBcIlN0cmF0ZWd5XCIsIFwiQmFja3Rlc3RpbmdcIl07XG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBkZWZhdWx0cykge1xuICAgICAgICAgICAgYXdhaXQgZGIuaW5zZXJ0KHNlY3Rpb25zKS52YWx1ZXMoe1xuICAgICAgICAgICAgICAgIGlkOiBgc2VjXyR7RGF0ZS5ub3coKX1fJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSl9YCxcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF3YWl0IGRiLnNlbGVjdCgpLmZyb20oc2VjdGlvbnMpLndoZXJlKGVxKHNlY3Rpb25zLnVzZXJJZCwgdXNlci5pZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB1c2VyU2VjdGlvbnM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVOb3RlKGRhdGE6IE9taXQ8dHlwZW9mIG5vdGVzLiRpbmZlckluc2VydCwgXCJ1c2VySWRcIj4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLmluc2VydChub3RlcykudmFsdWVzKHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgdXNlcklkOiB1c2VyLmlkXG4gICAgfSk7XG5cbiAgICByZXZhbGlkYXRlUGF0aChcIi9ub3RlYm9va1wiKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVOb3RlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8dHlwZW9mIG5vdGVzLiRpbmZlckluc2VydD4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLnVwZGF0ZShub3RlcylcbiAgICAgICAgLnNldCh7IC4uLmRhdGEsIHVwZGF0ZWRBdDogbmV3IERhdGUoKSB9KVxuICAgICAgICAud2hlcmUoYW5kKGVxKG5vdGVzLmlkLCBpZCksIGVxKG5vdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL25vdGVib29rXCIpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU5vdGUoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKCk7XG4gICAgY29uc3QgZGIgPSBnZXREYigpO1xuXG4gICAgYXdhaXQgZGIuZGVsZXRlKG5vdGVzKVxuICAgICAgICAud2hlcmUoYW5kKGVxKG5vdGVzLmlkLCBpZCksIGVxKG5vdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL25vdGVib29rXCIpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiK1JBb0RzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/app/actions/data:b382b1 [app-client] (ecmascript) <text/javascript>", ((__turbopack_context__) => {
"use strict";

/* __next_internal_action_entry_do_not_use__ [{"4058f5f1c1b84bcfd38d1c540621b4ab16a900800f":"deleteNote"},"app/actions/note-actions.ts",""] */ __turbopack_context__.s([
    "deleteNote",
    ()=>deleteNote
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)");
"use turbopack no side effects";
;
var deleteNote = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createServerReference"])("4058f5f1c1b84bcfd38d1c540621b4ab16a900800f", __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["callServer"], void 0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$webpack$2f$loaders$2f$next$2d$flight$2d$loader$2f$action$2d$client$2d$wrapper$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["findSourceMapURL"], "deleteNote"); //# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4vbm90ZS1hY3Rpb25zLnRzIl0sInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHNlcnZlclwiO1xuXG5pbXBvcnQgeyBhdXRoIH0gZnJvbSBcIkAvbGliL2F1dGhcIjtcbmltcG9ydCB7IGhlYWRlcnMgfSBmcm9tIFwibmV4dC9oZWFkZXJzXCI7XG5pbXBvcnQgeyBnZXREYiB9IGZyb20gXCJAL2xpYi9kYlwiO1xuaW1wb3J0IHsgbm90ZXMsIHNlY3Rpb25zLCBub3RlVGFncyB9IGZyb20gXCJAL2RiL3NjaGVtYVwiO1xuaW1wb3J0IHsgZXEsIGRlc2MsIGFuZCB9IGZyb20gXCJkcml6emxlLW9ybVwiO1xuaW1wb3J0IHsgcmV2YWxpZGF0ZVBhdGggfSBmcm9tIFwibmV4dC9jYWNoZVwiO1xuXG5hc3luYyBmdW5jdGlvbiBnZXRVc2VyKCkge1xuICAgIGNvbnN0IHNlc3Npb24gPSBhd2FpdCBhdXRoLmFwaS5nZXRTZXNzaW9uKHtcbiAgICAgICAgaGVhZGVyczogYXdhaXQgaGVhZGVycygpXG4gICAgfSk7XG4gICAgaWYgKCFzZXNzaW9uPy51c2VyKSB0aHJvdyBuZXcgRXJyb3IoXCJVbmF1dGhvcml6ZWRcIik7XG4gICAgcmV0dXJuIHNlc3Npb24udXNlcjtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGdldE5vdGVzKCkge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKCk7XG4gICAgY29uc3QgZGIgPSBnZXREYigpO1xuXG4gICAgLy8gRmV0Y2ggbm90ZXMgZGVzY2VuZGluZyBieSBkYXRlXG4gICAgcmV0dXJuIGF3YWl0IGRiLnNlbGVjdCgpXG4gICAgICAgIC5mcm9tKG5vdGVzKVxuICAgICAgICAud2hlcmUoZXEobm90ZXMudXNlcklkLCB1c2VyLmlkKSlcbiAgICAgICAgLm9yZGVyQnkoZGVzYyhub3Rlcy5kYXRlKSk7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBnZXRTZWN0aW9ucygpIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIC8vIEZldGNoIHNlY3Rpb25zIG9yIHJldHVybiBkZWZhdWx0cyBpZiBlbXB0eT9cbiAgICAvLyBVc2VyIG1pZ2h0IG5lZWQgdG8gaW5pdCBzZWN0aW9ucy5cbiAgICBjb25zdCB1c2VyU2VjdGlvbnMgPSBhd2FpdCBkYi5zZWxlY3QoKS5mcm9tKHNlY3Rpb25zKS53aGVyZShlcShzZWN0aW9ucy51c2VySWQsIHVzZXIuaWQpKTtcblxuICAgIGlmICh1c2VyU2VjdGlvbnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIC8vIEluaXQgZGVmYXVsdCBzZWN0aW9uc1xuICAgICAgICBjb25zdCBkZWZhdWx0cyA9IFtcIlRyYWRlIE5vdGVzXCIsIFwiRGFpbHkgSm91cm5hbFwiLCBcIlN0cmF0ZWd5XCIsIFwiQmFja3Rlc3RpbmdcIl07XG4gICAgICAgIGZvciAoY29uc3QgbmFtZSBvZiBkZWZhdWx0cykge1xuICAgICAgICAgICAgYXdhaXQgZGIuaW5zZXJ0KHNlY3Rpb25zKS52YWx1ZXMoe1xuICAgICAgICAgICAgICAgIGlkOiBgc2VjXyR7RGF0ZS5ub3coKX1fJHtNYXRoLnJhbmRvbSgpLnRvU3RyaW5nKDM2KS5zdWJzdHIoMiwgOSl9YCxcbiAgICAgICAgICAgICAgICBuYW1lLFxuICAgICAgICAgICAgICAgIHVzZXJJZDogdXNlci5pZFxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGF3YWl0IGRiLnNlbGVjdCgpLmZyb20oc2VjdGlvbnMpLndoZXJlKGVxKHNlY3Rpb25zLnVzZXJJZCwgdXNlci5pZCkpO1xuICAgIH1cblxuICAgIHJldHVybiB1c2VyU2VjdGlvbnM7XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiBjcmVhdGVOb3RlKGRhdGE6IE9taXQ8dHlwZW9mIG5vdGVzLiRpbmZlckluc2VydCwgXCJ1c2VySWRcIj4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLmluc2VydChub3RlcykudmFsdWVzKHtcbiAgICAgICAgLi4uZGF0YSxcbiAgICAgICAgdXNlcklkOiB1c2VyLmlkXG4gICAgfSk7XG5cbiAgICByZXZhbGlkYXRlUGF0aChcIi9ub3RlYm9va1wiKTtcbiAgICByZXR1cm4geyBzdWNjZXNzOiB0cnVlIH07XG59XG5cbmV4cG9ydCBhc3luYyBmdW5jdGlvbiB1cGRhdGVOb3RlKGlkOiBzdHJpbmcsIGRhdGE6IFBhcnRpYWw8dHlwZW9mIG5vdGVzLiRpbmZlckluc2VydD4pIHtcbiAgICBjb25zdCB1c2VyID0gYXdhaXQgZ2V0VXNlcigpO1xuICAgIGNvbnN0IGRiID0gZ2V0RGIoKTtcblxuICAgIGF3YWl0IGRiLnVwZGF0ZShub3RlcylcbiAgICAgICAgLnNldCh7IC4uLmRhdGEsIHVwZGF0ZWRBdDogbmV3IERhdGUoKSB9KVxuICAgICAgICAud2hlcmUoYW5kKGVxKG5vdGVzLmlkLCBpZCksIGVxKG5vdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL25vdGVib29rXCIpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbn1cblxuZXhwb3J0IGFzeW5jIGZ1bmN0aW9uIGRlbGV0ZU5vdGUoaWQ6IHN0cmluZykge1xuICAgIGNvbnN0IHVzZXIgPSBhd2FpdCBnZXRVc2VyKCk7XG4gICAgY29uc3QgZGIgPSBnZXREYigpO1xuXG4gICAgYXdhaXQgZGIuZGVsZXRlKG5vdGVzKVxuICAgICAgICAud2hlcmUoYW5kKGVxKG5vdGVzLmlkLCBpZCksIGVxKG5vdGVzLnVzZXJJZCwgdXNlci5pZCkpKTtcblxuICAgIHJldmFsaWRhdGVQYXRoKFwiL25vdGVib29rXCIpO1xuICAgIHJldHVybiB7IHN1Y2Nlc3M6IHRydWUgfTtcbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiK1JBNkVzQiJ9
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/components/notebook/NotebookClient.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>NotebookClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as Folder>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>");
var __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/lib/utils.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notebook$2f$Editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/components/notebook/Editor.tsx [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$f57d91__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:f57d91 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$b382b1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__ = __turbopack_context__.i("[project]/app/actions/data:b382b1 [app-client] (ecmascript) <text/javascript>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
;
;
;
function NotebookClient({ initialSections, initialNotes }) {
    _s();
    const [sections, setSections] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialSections);
    const [notes, setNotes] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialNotes);
    const [activeSection, setActiveSection] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(initialSections[0]?.id || "s1");
    const [activeNoteId, setActiveNoteId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "NotebookClient.useEffect": ()=>{
            setSections(initialSections);
            setNotes(initialNotes);
            if (initialSections.length > 0 && !initialSections.find({
                "NotebookClient.useEffect": (s)=>s.id === activeSection
            }["NotebookClient.useEffect"])) {
                setActiveSection(initialSections[0].id);
            }
        }
    }["NotebookClient.useEffect"], [
        initialSections,
        initialNotes
    ]);
    const handleCreateNote = async ()=>{
        const id = `note_${Date.now()}`;
        const date = new Date().toISOString().split('T')[0];
        // Optimistic
        const newNote = {
            id,
            sectionId: activeSection,
            title: "New Note",
            date,
            content: "",
            userId: "temp" // irrelevant for UI
        };
        setNotes([
            newNote,
            ...notes
        ]);
        setActiveNoteId(id);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$f57d91__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["createNote"])({
                id,
                sectionId: activeSection,
                title: "New Note",
                date,
                content: ""
            });
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };
    const handleDeleteNote = async (noteId)=>{
        if (!confirm("Are you sure you want to delete this note?")) return;
        setNotes(notes.filter((n)=>n.id !== noteId));
        if (activeNoteId === noteId) setActiveNoteId(null);
        try {
            await (0, __TURBOPACK__imported__module__$5b$project$5d2f$app$2f$actions$2f$data$3a$b382b1__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$text$2f$javascript$3e$__["deleteNote"])(noteId);
            router.refresh();
        } catch (error) {
            console.error(error);
        }
    };
    const handleNoteUpdated = ()=>{
        // Triggered by Editor on save. 
        // We might want to re-fetch or use router.refresh().
        // Editor calls onSave which we passed.
        router.refresh();
    };
    const currentNotes = notes.filter((n)=>n.sectionId === activeSection);
    const activeNote = notes.find((n)=>n.id === activeNoteId) || null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "flex h-screen max-h-[calc(100vh-2rem)] overflow-hidden m-4 rounded-xl border border-border bg-card shadow-sm",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-60 border-r border-border bg-muted/10 flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b border-border font-semibold flex justify-between items-center",
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                            children: "Notebooks"
                        }, void 0, false, {
                            fileName: "[project]/components/notebook/NotebookClient.tsx",
                            lineNumber: 99,
                            columnNumber: 21
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                        lineNumber: 98,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto p-2 space-y-1",
                        children: sections.map((section)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setActiveSection(section.id);
                                    setActiveNoteId(null);
                                },
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("w-full flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium hover:bg-muted transition-colors", activeSection === section.id ? "bg-primary/10 text-primary" : "text-muted-foreground"),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Folder$3e$__["Folder"], {
                                        className: "h-4 w-4"
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                                        lineNumber: 111,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "flex-1 text-left",
                                        children: section.name
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                                        lineNumber: 112,
                                        columnNumber: 29
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        className: "text-xs opacity-50",
                                        children: notes.filter((n)=>n.sectionId === section.id).length
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                                        lineNumber: 113,
                                        columnNumber: 29
                                    }, this)
                                ]
                            }, section.id, true, {
                                fileName: "[project]/components/notebook/NotebookClient.tsx",
                                lineNumber: 103,
                                columnNumber: 25
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                        lineNumber: 101,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/notebook/NotebookClient.tsx",
                lineNumber: 97,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "w-72 border-r border-border bg-background flex flex-col",
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "p-4 border-b border-border font-semibold flex justify-between items-center",
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                children: "Pages"
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/NotebookClient.tsx",
                                lineNumber: 122,
                                columnNumber: 21
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleCreateNote,
                                className: "hover:bg-muted p-1 rounded",
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Plus$3e$__["Plus"], {
                                    className: "h-4 w-4"
                                }, void 0, false, {
                                    fileName: "[project]/components/notebook/NotebookClient.tsx",
                                    lineNumber: 123,
                                    columnNumber: 95
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/components/notebook/NotebookClient.tsx",
                                lineNumber: 123,
                                columnNumber: 21
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                        lineNumber: 121,
                        columnNumber: 17
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        className: "flex-1 overflow-y-auto",
                        children: currentNotes.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            className: "p-4 text-sm text-muted-foreground text-center",
                            children: "No pages here"
                        }, void 0, false, {
                            fileName: "[project]/components/notebook/NotebookClient.tsx",
                            lineNumber: 127,
                            columnNumber: 25
                        }, this) : currentNotes.map((note)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("group w-full flex flex-col items-start px-4 py-3 border-b border-border/50 hover:bg-muted/50 transition-colors text-left relative cursor-pointer", activeNoteId === note.id ? "bg-muted/50 border-l-2 border-l-primary pl-[14px]" : ""),
                                onClick: ()=>setActiveNoteId(note.id),
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex justify-between w-full",
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                className: (0, __TURBOPACK__imported__module__$5b$project$5d2f$lib$2f$utils$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["cn"])("text-sm font-semibold", activeNoteId === note.id ? "text-primary" : ""),
                                                children: note.title
                                            }, void 0, false, {
                                                fileName: "[project]/components/notebook/NotebookClient.tsx",
                                                lineNumber: 139,
                                                columnNumber: 37
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                className: "opacity-0 group-hover:opacity-100 p-1 hover:bg-destructive/10 text-destructive rounded transition-all",
                                                onClick: (e)=>{
                                                    e.stopPropagation();
                                                    handleDeleteNote(note.id);
                                                },
                                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__default__as__Trash2$3e$__["Trash2"], {
                                                    className: "h-3 w-3"
                                                }, void 0, false, {
                                                    fileName: "[project]/components/notebook/NotebookClient.tsx",
                                                    lineNumber: 147,
                                                    columnNumber: 41
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/components/notebook/NotebookClient.tsx",
                                                lineNumber: 140,
                                                columnNumber: 37
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                                        lineNumber: 138,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        className: "flex items-center justify-between mt-1 w-full",
                                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            className: "text-xs text-muted-foreground",
                                            children: note.date
                                        }, void 0, false, {
                                            fileName: "[project]/components/notebook/NotebookClient.tsx",
                                            lineNumber: 151,
                                            columnNumber: 37
                                        }, this)
                                    }, void 0, false, {
                                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                                        lineNumber: 150,
                                        columnNumber: 33
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        className: "text-xs text-muted-foreground mt-1 line-clamp-1",
                                        children: [
                                            note.content.substring(0, 30),
                                            "..."
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                                        lineNumber: 153,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, note.id, true, {
                                fileName: "[project]/components/notebook/NotebookClient.tsx",
                                lineNumber: 130,
                                columnNumber: 29
                            }, this))
                    }, void 0, false, {
                        fileName: "[project]/components/notebook/NotebookClient.tsx",
                        lineNumber: 125,
                        columnNumber: 17
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/components/notebook/NotebookClient.tsx",
                lineNumber: 120,
                columnNumber: 13
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "flex-1 bg-background",
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$components$2f$notebook$2f$Editor$2e$tsx__$5b$app$2d$client$5d$__$28$ecmascript$29$__["Editor"], {
                    selectedNote: activeNote,
                    onSave: handleNoteUpdated
                }, activeNote ? activeNote.id : 'empty', false, {
                    fileName: "[project]/components/notebook/NotebookClient.tsx",
                    lineNumber: 162,
                    columnNumber: 17
                }, this)
            }, void 0, false, {
                fileName: "[project]/components/notebook/NotebookClient.tsx",
                lineNumber: 161,
                columnNumber: 13
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/components/notebook/NotebookClient.tsx",
        lineNumber: 94,
        columnNumber: 9
    }, this);
}
_s(NotebookClient, "5ZNlEvQuvfPhq5r9UGQ6IYsiHek=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = NotebookClient;
var _c;
__turbopack_context__.k.register(_c, "NotebookClient");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Folder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
            key: "1kt360"
        }
    ]
];
const Folder = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("folder", __iconNode);
;
 //# sourceMappingURL=folder.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript) <export default as Folder>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Folder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$folder$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/folder.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Plus
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M5 12h14",
            key: "1ays0h"
        }
    ],
    [
        "path",
        {
            d: "M12 5v14",
            key: "s699le"
        }
    ]
];
const Plus = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("plus", __iconNode);
;
 //# sourceMappingURL=plus.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript) <export default as Plus>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Plus",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$plus$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/plus.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Trash2
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M10 11v6",
            key: "nco0om"
        }
    ],
    [
        "path",
        {
            d: "M14 11v6",
            key: "outv1u"
        }
    ],
    [
        "path",
        {
            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
            key: "miytrc"
        }
    ],
    [
        "path",
        {
            d: "M3 6h18",
            key: "d0wm0j"
        }
    ],
    [
        "path",
        {
            d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
            key: "e791ji"
        }
    ]
];
const Trash2 = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trash-2", __iconNode);
;
 //# sourceMappingURL=trash-2.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript) <export default as Trash2>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trash2",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2d$2$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash-2.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Tag
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z",
            key: "vktsd0"
        }
    ],
    [
        "circle",
        {
            cx: "7.5",
            cy: "7.5",
            r: ".5",
            fill: "currentColor",
            key: "kqv944"
        }
    ]
];
const Tag = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("tag", __iconNode);
;
 //# sourceMappingURL=tag.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript) <export default as Tag>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Tag",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$tag$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/tag.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Save
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M15.2 3a2 2 0 0 1 1.4.6l3.8 3.8a2 2 0 0 1 .6 1.4V19a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z",
            key: "1c8476"
        }
    ],
    [
        "path",
        {
            d: "M17 21v-7a1 1 0 0 0-1-1H8a1 1 0 0 0-1 1v7",
            key: "1ydtos"
        }
    ],
    [
        "path",
        {
            d: "M7 3v4a1 1 0 0 0 1 1h7",
            key: "t51u73"
        }
    ]
];
const Save = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("save", __iconNode);
;
 //# sourceMappingURL=save.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript) <export default as Save>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Save",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$save$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/save.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Check
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M20 6 9 17l-5-5",
            key: "1gmf2c"
        }
    ]
];
const Check = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("check", __iconNode);
;
 //# sourceMappingURL=check.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript) <export default as Check>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Check",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$check$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/check.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/trash.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>Trash
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6",
            key: "miytrc"
        }
    ],
    [
        "path",
        {
            d: "M3 6h18",
            key: "d0wm0j"
        }
    ],
    [
        "path",
        {
            d: "M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
            key: "e791ji"
        }
    ]
];
const Trash = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("trash", __iconNode);
;
 //# sourceMappingURL=trash.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/trash.js [app-client] (ecmascript) <export default as Trash>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "Trash",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$trash$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/trash.js [app-client] (ecmascript)");
}),
"[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/**
 * @license lucide-react v0.556.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */ __turbopack_context__.s([
    "__iconNode",
    ()=>__iconNode,
    "default",
    ()=>X
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/createLucideIcon.js [app-client] (ecmascript)");
;
const __iconNode = [
    [
        "path",
        {
            d: "M18 6 6 18",
            key: "1bl5f8"
        }
    ],
    [
        "path",
        {
            d: "m6 6 12 12",
            key: "d8bk6v"
        }
    ]
];
const X = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$createLucideIcon$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"])("x", __iconNode);
;
 //# sourceMappingURL=x.js.map
}),
"[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript) <export default as X>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "X",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$lucide$2d$react$2f$dist$2f$esm$2f$icons$2f$x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/lucide-react/dist/esm/icons/x.js [app-client] (ecmascript)");
}),
"[project]/node_modules/next/dist/build/webpack/loaders/next-flight-loader/action-client-wrapper.js [app-client] (ecmascript)", ((__turbopack_context__, module, exports) => {
"use strict";

// This file must be bundled in the app's client layer, it shouldn't be directly
// imported by the server.
Object.defineProperty(exports, "__esModule", {
    value: true
});
0 && (module.exports = {
    callServer: null,
    createServerReference: null,
    findSourceMapURL: null
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    callServer: function() {
        return _appcallserver.callServer;
    },
    createServerReference: function() {
        return _client.createServerReference;
    },
    findSourceMapURL: function() {
        return _appfindsourcemapurl.findSourceMapURL;
    }
});
const _appcallserver = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-call-server.js [app-client] (ecmascript)");
const _appfindsourcemapurl = __turbopack_context__.r("[project]/node_modules/next/dist/client/app-find-source-map-url.js [app-client] (ecmascript)");
const _client = __turbopack_context__.r("[project]/node_modules/next/dist/compiled/react-server-dom-turbopack/client.js [app-client] (ecmascript)"); //# sourceMappingURL=action-client-wrapper.js.map
}),
]);

//# sourceMappingURL=_85828ecd._.js.map