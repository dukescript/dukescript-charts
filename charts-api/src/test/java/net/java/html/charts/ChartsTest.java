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
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.Callable;
import java.util.concurrent.CountDownLatch;
import java.util.concurrent.Executors;
import javafx.application.Platform;
import net.java.html.boot.BrowserBuilder;
import org.netbeans.html.boot.spi.Fn;
import static org.testng.Assert.assertEquals;
import static org.testng.Assert.assertNotNull;
import static org.testng.Assert.fail;
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

        class CheckRenderAndRemove1st implements Callable<Void> {
            @Override
            public Void call() throws Exception {
                assertInt(chart.eval("datasets.length"), 2, "Two datasets");
                assertEquals(chart.eval("datasets[0].label"), "My First dataset");
                assertInt(chart.eval("datasets[0].points.length"), 7, "Seven values set 0");
                assertInt(chart.eval("datasets[1].points.length"), 7, "Seven values set 1");
                assertInt(chart.eval("datasets[1].points[0].value"), 28, "1st value in 2nd set");
                assertEquals(chart.eval("datasets[1].points[0].label"), "January", "1st label");
                assertEquals(chart.eval("datasets[1].points[0].datasetLabel"), "My Second dataset", "2nd data set label");

                chart.getData().remove(0);
                return null;
            }
        }

        CheckRenderAndRemove1st cr = new CheckRenderAndRemove1st();
        run(cr);

        waitForAnimation();

        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                assertInt(chart.eval("datasets.length"), 2, "Two datasets");
                assertInt(chart.eval("datasets[0].points.length"), 6, "Just six values set 0");
                assertInt(chart.eval("datasets[1].points.length"), 6, "Just six values set 1");
                assertInt(chart.eval("datasets[0].points[0].value"), 59, "1st value in 1nd set");
                assertInt(chart.eval("datasets[1].points[0].value"), 48, "1st value in 2nd set");
                return null;
            }
        });
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
        final List<Chart<Segment, Config>> pies = new ArrayList<>();
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                Chart<Segment, Config> pieChart = Chart.createDoughnut();
                pies.add(pieChart);
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
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                assertInt(chart.eval("segments.length"), 3, "Three segments");
                assertEquals(chart.eval("segments[2].label"), "blue");
                assertInt(chart.eval("segments[2].value"), 42, "Three hundred red");

                pies.get(0).getData().add(2, new Segment("black", 100, Color.rgba(0, 0, 0, 0), Color.valueOf("black")));
                return null;
            }
        });
        waitForAnimation();
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                assertInt(chart.eval("segments.length"), 4, "Four segments");
                assertEquals(chart.eval("segments[2].label"), "black");
                assertInt(chart.eval("segments[2].value"), 100, "Three hundred red");
                assertEquals(chart.eval("segments[3].label"), "blue");
                assertInt(chart.eval("segments[3].value"), 42, "Three hundred red");
                return null;
            }
        });
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
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                assertInt(chart.eval("segments.length"), 5, "Five segments");
                assertEquals(chart.eval("segments[0].label"), "Red");
                assertInt(chart.eval("segments[0].value"), 300, "Three hundred red");
                assertEquals(chart.eval("segments[2].label"), "Yello");
                assertInt(chart.eval("segments[2].value"), 100, "Three hundred red");

                chart.getData().remove(2);
                return null;
            }
        });
        waitForAnimation();
        run(new Callable<Void>() {
            @Override
            public Void call() throws Exception {
                assertInt(chart.eval("segments.length"), 4, "Four segments");
                assertEquals(chart.eval("segments[0].label"), "Red");
                assertInt(chart.eval("segments[0].value"), 300, "Three hundred red");
                assertEquals(chart.eval("segments[2].label"), "Grey");
                assertInt(chart.eval("segments[2].value"), 40, "Fourty");
                return null;
            }
        });
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
        final Throwable[] arr = { null };
        Platform.runLater(new Runnable() {
            @Override
            public void run() {
                try (Closeable c = Fn.activate(presenter)) {
                    r.call();
                } catch (Throwable t) {
                    arr[0] = t;
                } finally {
                    await.countDown();
                }
            }
        });
        await.await();
        if (arr[0] instanceof Exception) {
            throw (Exception)arr[0];
        }
        if (arr[0] instanceof Error) {
            throw (Error)arr[0];
        }
    }

    @Override
    public synchronized void run() {
        animationComplete = true;
        notifyAll();
    }

    private void waitForAnimation() throws Exception {
        waitForAnimationImpl();
    }
    private synchronized void waitForAnimationImpl() throws Exception {
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

    static void assertInt(Object real, int exp, String msg) {
        if (real instanceof Number) {
            assertEquals(((Number)real).intValue(), exp, msg);
        } else {
            fail("Expecting number: " + real);
        }
    }
}
