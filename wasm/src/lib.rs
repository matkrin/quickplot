mod utils;

use linfa_linalg::qr::LeastSquaresQr;
use ndarray::{Array, Array2, ArrayView};
use wasm_bindgen::prelude::*;

#[wasm_bindgen]
extern "C" {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn greet() {
    alert("Hello, correct-plane!");
}

#[wasm_bindgen]
pub fn correct_plane_wasm(arr: Vec<f32>, xres: usize, yres: usize) -> Vec<f32> {
    dbg!(&arr.len());
    let img_data = Array::from_vec(arr.clone())
        .into_shape((xres, yres))
        .unwrap();
    let img_data_flat = Array::from_vec(arr).into_shape((xres * yres, 1)).unwrap();
    let ones: Array2<f32> = Array::ones((xres, yres));

    let mut coeffs: Array2<f32> = Array::ones((xres * yres, 1));
    let x_coords = Array::from_shape_fn((xres, yres), |(_, j)| j as f32);
    let y_coords = Array::from_shape_fn((xres, yres), |(i, _)| i as f32);

    let x_view = ArrayView::from(&x_coords);
    let x_coords_flat = x_view.into_shape(xres * yres).unwrap();
    dbg!(&x_coords.shape());
    dbg!(&x_coords_flat.shape());
    coeffs.push_column(x_coords_flat).unwrap();
    coeffs
        .push_column(ArrayView::from(&y_coords).into_shape(xres * yres).unwrap())
        .unwrap();
    let res = coeffs.least_squares(&img_data_flat).unwrap();
    let correction = ones * res[[0, 0]] + x_coords * res[[1, 0]] + y_coords * res[[2, 0]];
    let s = img_data - correction;

    s.into_raw_vec()
}
