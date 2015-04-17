var std_t =
  "<div style='margin: 0 auto;'>" +
  "<!--[if mso]>" +
    "<v:rect xmlns:v='urn:schemas-microsoft-com:vml' xmlns:w='urn:schemas-microsoft-com:office:word' href='{{linkurl}}' style='height:{{height}}px;v-text-anchor:middle;width:{{width}}px;' arcsize='16%' strokecolor='{{backcolor}}' fill='t'>" +
      "<v:fill {{#if backimage}}type='tile' src='{{backimage}}'{{/if}} color='{{backcolor}}' />" +
        "<w:anchorlock/>" +
        "<center style='color:{{forecolor}};font-family:sans-serif;font-size:{{mso_fontsize}}px;font-weight:bold;'>{{buttontext}}</center>" +
      "</v:rect>" +
  "<![endif]-->" +
  "<div style='margin: 0 auto;mso-hide:all;'>" +
    "<table align='center' cellpadding='0' cellspacing='0' height='{{height}}' width='{{width}}' style='margin: 0 auto; mso-hide:all;'>" +
      "<tbody><tr>" +
        "<td align='center' bgcolor='{{backcolor}}' height='{{height}}' style='vertical-align:middle;color:{{forecolor}};display:block;background-color:{{backcolor}};{{#if backimage}}background-image:url({{backimage}});{{/if}}border:1px solid {{backcolor}};mso-hide:all;' width='{{width}}'>" +
            "<a class='cta_button' href='{{linkurl}}' style='font-size:{{fontsize}}px;-webkit-text-size-adjust:none; font-weight: bold; font-family:sans-serif; text-decoration: none; line-height:{{height}}px; width:{{width}}px; display:inline-block;' title='{{buttontext}}' target='_blank'>" +
          "<span style='color:{{forecolor}}'>{{buttontext}}</span></a>" +
        "</td></tr>"+
      "</tbody>"+
    "</table>"+
  "</div>" +
  "</div>",
  button_opts = {
    forecolor: "#ffffff",
    backcolor: "#468EE5",
    buttontext: "Click Here",
    height: "50",
    width: "250",
    fontsize: "16",
    mso_fontsize: "18",
    linkurl: "http://www.govdelivery.com",
    backimage: null
  }, template, compiled_template;

function _roundToTwo(num) {
    return +(Math.round(num + "e+2") + "e-2");
}

function _hexToRgb(hex) {
    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

//alert( hexToRgb("#a4a4a4").g ); // "51";

function _luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
        v /= 255;
        return (v <= 0.03928) ? v / 12.92 : Math.pow(((v + 0.055) / 1.055), 2.4);
    });
    return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}
/* (luminanace(255, 255, 255) + 0.05) / (luminanace(255, 255, 0) + 0.05); */
// 1.074 for yellow
/* (luminanace(255, 255, 255) + 0.05) / (luminanace(0, 0, 255) + 0.05); */
// 8.592 for blue
// minimal recommended contrast ratio is 4.5 or 3 for larger font-sizes

function _test(){
  var contrast = 0;
  var result = "<p>Contrast ratio is: ";
  var ctest = "";
  //calculate luminance
  var fg_lum = _luminance(_hexToRgb(button_opts.forecolor).r, _hexToRgb(button_opts.forecolor).g, _hexToRgb(button_opts.forecolor).b);
  var bg_lum = _luminance(_hexToRgb(button_opts.backcolor).r, _hexToRgb(button_opts.backcolor).g, _hexToRgb(button_opts.backcolor).b);
  if (bg_lum > fg_lum) {
      contrast = (bg_lum + 0.05) / (fg_lum + 0.05);
  } else {
      contrast = (fg_lum + 0.05) / (bg_lum + 0.05);
  }
  ctest = parseInt(_roundToTwo(contrast)) < 3  ? "<b>Fails</b> WCAG AA Contrast" : "<b>Passes</b> WCAG AA Contrast";
  result = result + _roundToTwo(contrast) + ":1 </p><p>" + ctest + "</p>";
  $("#result").html(result);
}

function generate(){
  template = Handlebars.compile(std_t);
  compiled_template = template(button_opts);
  $("#render_preview").html(compiled_template);
  $("#code_preview").val(compiled_template);
  _test();
}

function init(){
  $("#forecolor").val(button_opts.forecolor);
  $("#backcolor").val(button_opts.backcolor);
  $("#width").val(button_opts.width);
  $("#height").val(button_opts.height);
  $("#buttontext").val(button_opts.buttontext);
  $("#linkurl").val(button_opts.linkurl);
  $("#fontsize").val(button_opts.fontsize);
  generate();
}

$("#gen_button").click(function (e){
  // TODO field validation
  // TODO better way of gettin and setting form
  button_opts.forecolor = $("#forecolor").val();
  button_opts.backcolor = $("#backcolor").val();
  button_opts.width = $("#width").val();
  button_opts.height = $("#height").val();
  button_opts.buttontext = $("#buttontext").val();

  button_opts.backimage = $("#background_image").val().trim() === "" ? null : $("#background_image").val();

  button_opts.linkurl = $("#linkurl").val();

  button_opts.fontsize = $("#fontsize").val();
  button_opts.mso_fontsize = parseInt(button_opts.fontsize) + 2;

  generate();
});

init();
