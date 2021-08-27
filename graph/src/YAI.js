import React from 'react';
import __html from './bodyInString';

// CSS for YAI
import './YAIcss/style.css';
import './YAIcss/tree.css';
import './YAIcss/lib/bootstrap-4.5.2.min.css';
import './YAIcss/lib/bootstrap-vue-2.16.0.min.css';

/* const SCRIPTS = [
    "/yai/js/lib/jquery-3.5.1.min.js",
    // "/yai/js/lib/vue-2.6.14.min.js",
    "/yai/js/lib/vue-2.6.14.min.js",
    "/yai/js/lib/bootstrap-vue-2.16.0.min.js",
    // "/yai/js/lib/apexcharts-3.27.3.min.js",
    // "/yai/js/lib/vue-apexcharts-1.6.2.min.js",
    "https://cdn.jsdelivr.net/npm/apexcharts",
    "https://cdn.jsdelivr.net/npm/vue-apexcharts",
    "https://d3js.org/d3.v4.js",
    "/yai/js/lib/common_fn.js",
    "/yai/js/template/template_lib.js",
    "/yai/js/template/template.js",
    "/yai/js/template/jsonld_handler.js",
    "/yai/js/stage_builder/item_stage_builder.js",
    "/yai/js/stage_builder/domain_stage_builder.js",
    "/yai/js/stage_builder/api_lib.js",
    "/yai/js/vue_component/explanation_components.js",
    "/yai/js/app.js",
] */

const YAI = () => {
    React.useEffect(() => {
        const js2 = document.createElement('script');
        js2.src = "/yai/js/app.js";
        document.body.appendChild(js2);
    }, []);
    return (
        <div dangerouslySetInnerHTML={{ __html }}></div>
    );
}

export default YAI;