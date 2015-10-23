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

import com.sun.glass.ui.Window;
import java.io.Closeable;
import java.util.Arrays;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import javafx.application.Platform;
import net.java.html.boot.BrowserBuilder;
import org.netbeans.html.boot.spi.Fn;
import static org.testng.Assert.assertNotNull;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;
import org.testng.annotations.Test;

public class ChartsTest implements Runnable {
    private Chart<?,?> chart;
    private Fn.Presenter presenter;
    private boolean animationComplete;

    @BeforeMethod
    public void initializePresenter() throws InterruptedException {
        animationComplete = false;
        final CountDownLatch initialized = new CountDownLatch(1);
        final BrowserBuilder builder = BrowserBuilder.newBrowser().
            loadPage("charts.html").
            loadFinished(new Runnable() {
                @Override
                public void run() {
                    presenter = Fn.activePresenter();
                    initialized.countDown();
                }
            });
        Executors.newSingleThreadExecutor().execute(new Runnable() {
            @Override
            public void run() {
                builder.showAndWait();
            }
        });
        initialized.await();
        assertNotNull(presenter, "We have the presenter");
    }

    @Test
    public void lineChart() throws Exception {
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                Chart<Values, Config> lineChart = Chart.createLine(new Values.Set(
                    "My First dataset",
                    Color.rgba(220,220,220,0.2),
                    Color.rgba(220,220,220,1.0)
                ), new Values.Set(
                    "My Second dataset",
                    Color.rgba(151,187,205,0.2),
                    Color.rgba(151,187,205,1)
                ));
                lineChart.getConfig().callback("onAnimationComplete", ChartsTest.this);

                lineChart.getData().addAll(Arrays.asList(
                    new Values("January", 65, 28),
                    new Values("February", 59, 48),
                    new Values("March", 80, 40),
                    new Values("April", 81, 19),
                    new Values("May", 56, 86),
                    new Values("June", 55, 27),
                    new Values("July", 40, 90)
                ));

                lineChart.applyTo("lineChart");

                chart = lineChart;

                return null;
            }
        });

        waitForAnimation();
    }

    @Test
    public void barChart() throws Exception {
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                Chart<Values, Config> barChart = Chart.createBar(new Values.Set(
                    "My First dataset",
                    Color.rgba(220,220,220,0.2),
                    Color.rgba(220,220,220,1.0)
                ), new Values.Set(
                    "My Second dataset",
                    Color.rgba(151,187,205,0.2),
                    Color.rgba(151,187,205,1)
                ));
                barChart.getConfig().callback("onAnimationComplete", ChartsTest.this);

                barChart.getData().addAll(Arrays.asList(
                    new Values("January", 65, 28),
                    new Values("February", 59, 48),
                    new Values("March", 80, 40),
                    new Values("April", 81, 19),
                    new Values("May", 56, 86),
                    new Values("June", 55, 27),
                    new Values("July", 40, 90)
                ));

                barChart.applyTo("barChart");

                chart = barChart;
                return null;
            }
        });

        waitForAnimation();
    }

    @Test
    public void radarChart() throws Exception {
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                Chart<Values, Config> radarChart = Chart.createRadar(new Values.Set(
                    "My First dataset",
                    Color.rgba(220,220,220,0.2),
                    Color.rgba(220,220,220,1.0)
                ), new Values.Set(
                    "My Second dataset",
                    Color.rgba(151,187,205,0.2),
                    Color.rgba(151,187,205,1)
                ));
                radarChart.getConfig().callback("onAnimationComplete", ChartsTest.this);

                radarChart.getData().addAll(Arrays.asList(
                    new Values("January", 65, 28),
                    new Values("February", 59, 48),
                    new Values("March", 80, 40),
                    new Values("April", 81, 19),
                    new Values("May", 56, 86),
                    new Values("June", 55, 27),
                    new Values("July", 40, 90)
                ));

                radarChart.applyTo("barChart");

                chart = radarChart;
                return null;
            }
        });

        waitForAnimation();
    }

    @Test
    public void pieChart() throws Exception {
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                Chart<Segment, Config> pieChart = Chart.createPie();
                pieChart.getConfig().callback("onAnimationComplete", ChartsTest.this);

                pieChart.getData().addAll(Arrays.asList(
                    new Segment("red", 25, Color.rgba(128, 0, 0, 1), Color.rgba(255, 0, 0, 0.5)),
                    new Segment("green", 33, Color.rgba(0, 128, 0, 1), Color.rgba(0, 255, 0, 0.5)),
                    new Segment("blue", 42, Color.rgba(0, 0, 255, 1), Color.rgba(0, 0, 255, 0.5))
                ));

                pieChart.applyTo("pieChart");

                chart = pieChart;
                return null;
            }
        });

        waitForAnimation();
    }

    @Test
    public void doughtnutChart() throws Exception {
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                Chart<Segment, Config> pieChart = Chart.createDoughnut();
                pieChart.getConfig().callback("onAnimationComplete", ChartsTest.this);

                pieChart.getData().addAll(Arrays.asList(
                    new Segment("red", 25, Color.rgba(128, 0, 0, 0), Color.rgba(255, 0, 0, 0)),
                    new Segment("green", 33, Color.rgba(0, 128, 0, 0), Color.rgba(0, 255, 0, 0)),
                    new Segment("blue", 42, Color.rgba(0, 0, 255, 0), Color.rgba(0, 0, 255, 0))
                ));

                pieChart.applyTo("doughnutChart");

                chart = pieChart;
                return null;
            }
        });

        waitForAnimation();
    }

    @Test
    public void polarChart() throws Exception {
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                Chart<Segment, Config> polarChart = Chart.createPolar();
                polarChart.getConfig().callback("onAnimationComplete", ChartsTest.this);

                polarChart.getData().addAll(Arrays.asList(
                    new Segment("Red", 300, Color.valueOf("#F7464A"), Color.valueOf("#FF5A5E")),
                    new Segment("Green", 50, Color.valueOf("#46BFBD"), Color.valueOf("#5AD3D1")),
                    new Segment("Yello", 100, Color.valueOf("#FDB45C"), Color.valueOf("#FFC870")),
                    new Segment("Grey", 40, Color.valueOf("#949FB1"), Color.valueOf("#A8B3C5")),
                    new Segment("Dark Grey", 120, Color.valueOf("#4D5360"), Color.valueOf("#616774"))
                ));

                polarChart.applyTo("polarChart");

                chart = polarChart;
                return null;
            }
        });
        waitForAnimation();
    }

    @AfterMethod
    public void cleanUpTheGraph() throws Exception {
        if (chart != null) {
            run(new Callable<Void>() {
                @Override
                public Void call() throws Exception {
                    chart.destroy();
                    chart = null;
                    return null;
                }
            });
        }
    }

    private void run(final Callable<?> r) throws Exception {
        final CountDownLatch await = new CountDownLatch(1);
        final Exception[] arr = { null };
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                try (Closeable c = Fn.activate(presenter)) {
                    r.call();
                } catch (Exception t) {
                    arr[0] = t;
                } finally {
                    await.countDown();
                }
            }
        });
        await.await();
        if (arr[0] != null) {
            throw arr[0];
        }
    }

    @Override
    public synchronized void run() {
        animationComplete = true;
        notifyAll();
    }

    private synchronized void waitForAnimation() throws Exception {
        while (!animationComplete) {
            wait(1000);
            run(new Callable<Void>() {
                @Override
                public Void call() throws Exception {
                    for (Window w : Window.getWindows()) {
                        w.setSize(w.getWidth(), w.getHeight() - 1);
                    }
                    return null;
                }
            });
        }
    }
}
