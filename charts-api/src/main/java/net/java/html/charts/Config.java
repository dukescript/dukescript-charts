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
 * <a href="http://www.chartjs.org/docs/#getting-started-global-chart-configuration">
 * Global Chart Configuration</a>.
 */
public class Config {
    private final Object js;

    Config() {
        js = initConfig();
    }

    /** Creates new generic configuration object.
     * @return new, empty instance of configuration object
     */
    public static Config create() {
        return new Config();
    }

    /** Assigns a value to the config object. The list of supported properties is available at
     * <a href="http://www.chartjs.org/docs/#getting-started-global-chart-configuration">
     * Global Chart Configuration</a>.
     *
     * @param propertyName name of the property
     * @param value value for the property ({@link String}, <code>int</code>,
     *      <code>double</code> or <code>boolean</code>)
     * @return <code>this</code>
     */
    public Config set(String propertyName, Object value) {
        set(js, propertyName, value);
        return this;
    }

    @JavaScriptBody(args = {  }, body = "return {};")
    private static native Object initConfig();

    @JavaScriptBody(args = { "config", "name", "value" }, wait4js = false, body =
        "config[name] = value;"
    )
    private static native void set(Object config, String name, Object value);
}
