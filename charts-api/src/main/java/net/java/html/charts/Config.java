package net.java.html.charts;

/*
 * #%L
 * charts-api - a library from the "DukeScript" project.
 * %%
 * Copyright (C) 2015 Dukehoff GmbH
 * %%
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * #L%
 */

import net.java.html.js.JavaScriptBody;

/**
 * Generic configuration object.
 * Allows to set any property via {@link #set(java.lang.String, java.lang.Object)}
 * method. The list of supported properties is available at
 * <a href="https://github.com/chartjs/Chart.js/blob/v1.0.2/docs/00-Getting-Started.md">
 * Global Chart Configuration</a>.
 */
public class Config {
    final Object js;

    Config() {
        js = initConfig("responsive", true);
    }

    /** Creates new generic configuration object.
     * @return new, empty instance of configuration object
     */
    public static Config create() {
        return new Config();
    }

    /** Assigns a value to the config object. The list of supported properties is available at
     * <a href="https://github.com/chartjs/Chart.js/blob/v1.0.2/docs/00-Getting-Started.md">
     * Global Chart Configuration</a>.
     *
     * @param propertyName name of the property
     * @param value value for the property ({@link String}, <code>int</code>,
     *      <code>double</code> or <code>boolean</code>)
     * @return <code>this</code>
     */
    public final Config set(String propertyName, Object value) {
        set(js, propertyName, value);
        return this;
    }

    /** Assigns a callback to the config object. The list of supported callback names
     * is available at
     * <a href="https://github.com/chartjs/Chart.js/blob/v1.0.2/docs/00-Getting-Started.md">
     * Global Chart Configuration</a> - just search for the properties to which
     * a <b>function</b> can be assigned.
     *
     * @param name the name of the property to assign
     * @param run the function to callback when that property is triggered
     * @return <code>this</code>
     */
    public final Config callback(String name, Runnable run) {
        setFn(js, name, run);
        return this;
    }

    @JavaScriptBody(args = { "initNameValuePairs" }, body =
        "var obj = {};\n" +
        "for (var i = 0; i < initNameValuePairs.length; i += 2) {\n" +
        "  obj[initNameValuePairs[i]] = initNameValuePairs[i + 1];\n" +
        "};\n" +
        "return obj;\n"
    )
    private static native Object initConfig(Object... initNameValuePairs);

    @JavaScriptBody(args = { "config", "name", "value" }, wait4js = false, body =
        "config[name] = value;"
    )
    private static native void set(Object config, String name, Object value);

    @JavaScriptBody(args = { "config", "name", "run" }, wait4js = false, javacall = true, body =
        "config[name] = function() { run.@java.lang.Runnable::run()(); };"
    )
    private native void setFn(Object config, String name, Runnable run);
}
