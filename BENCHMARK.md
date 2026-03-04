# Scrape Benchmarks

## Individual Stats (Headless = true)

| URL                   | Run | Browser Launch (ms) | Page Open (ms) | Page Nav (ms) | Page Close (ms) | Browser Close (ms) |
| --------------------- | --- | ------------------- | -------------- | ------------- | --------------- | ------------------ |
| example.com           | 1   | 1087                | 614            | 575           | 7               | 250                |
| example.com           | 2   | 936                 | 556            | 570           | 7               | 462                |
| example.com           | 3   | 947                 | 71             | 572           | 7               | 1114               |
| example.com           | 4   | 954                 | 551            | 570           | 7               | 297                |
| example.com           | 5   | 885                 | 544            | 567           | 6               | 65                 |
| excalidraw.com        | 1   | 859                 | 67             | 2550          | 14              | 532                |
| excalidraw.com        | 2   | 721                 | 577            | 2382          | 15              | 80                 |
| excalidraw.com        | 3   | 576                 | 67             | 2190          | 7               | 128                |
| excalidraw.com        | 4   | 611                 | 68             | 2296          | 7               | 57                 |
| excalidraw.com        | 5   | 593                 | 75             | 2163          | 11              | 385                |
| google.com            | 1   | 976                 | 556            | 2952          | 16              | 80                 |
| google.com            | 2   | 895                 | 540            | 2672          | 45              | 60                 |
| google.com            | 3   | 873                 | 668            | 2682          | 13              | 66                 |
| google.com            | 4   | 794                 | 76             | 3364          | 13              | 72                 |
| google.com            | 5   | 647                 | 76             | 2697          | 11              | 155                |
| github.com            | 1   | 669                 | 137            | 4421          | 145             | 140                |
| github.com            | 2   | 618                 | 74             | 4466          | 146             | 98                 |
| github.com            | 3   | 608                 | 511            | 9066          | 14              | 115                |
| github.com            | 4   | 606                 | 510            | 4108          | 111             | 160                |
| github.com/dwi11harsh | 1   | 586                 | 495            | 4304          | 23              | 74                 |
| github.com/dwi11harsh | 2   | 628                 | 521            | 3545          | 16              | 78                 |
| github.com/dwi11harsh | 3   | 500                 | 505            | 3402          | 19              | 71                 |
| github.com/dwi11harsh | 4   | 1036                | 564            | 3405          | 23              | 83                 |

## Aggregated Stats (Headless = true)

| Metric         | Avg (ms) | Min | Max  |
| -------------- | -------- | --- | ---- |
| Browser Launch | ~962     | 885 | 1087 |
| Page Init      | ~467     | 71  | 614  |
| Navigation     | ~571     | 567 | 575  |
| Browser Close  | ~438     | 65  | 1114 |

## Cost Range (Headless = true)

| Operation               | Typical Cost Range |
| ----------------------- | ------------------ |
| Browser Launch          | 600–1100ms         |
| Page Init               | 70–600ms           |
| Navigation (light site) | 500–700ms          |
| Navigation (heavy SPA)  | 2–9s               |
| Page Close              | ~10ms              |
| Browser Close           | 60–400ms           |
