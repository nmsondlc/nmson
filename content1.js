chrome.storage.local.get("trangthai", function(result) 
{
	if (result.trangthai==undefined)
	{
		
		chrome.storage.local.set({trangthai:1}, function() 
		{
			console.log('Mặc định trạng thái check thẻ hoạt động');
			runBHYT();
        });
		console.log(result.trangthai);
	}else if (result.trangthai==1) 
	{
		runBHYT();
		console.log('Đã chạy check thẻ');
	}else 
	{
		console.log(result.trangthai);
		console.log('Không check thẻ');
	}
});
function reloadDataSelXa(maHuyen, maXa) {
        var fqh;
        fqh = $("#maxa_cu_tru");
		//console.log('maHuyen: '+maHuyen+' '+maXa);
        $.getJSON('lay-ds-xa-theo-tt30?maHuyen=' + maHuyen, function(data) {
            fqh.empty();
            if (data) {
                if(maXa == "0")
					
                    fqh.append($('<option selected/>').val('0').text("Chọn xã (TT30)"));
                else
                    fqh.append($('<option/>').val('0').text("Chọn xã (TT30)"));

                $.each(data, function(i) {
                    //if(maXa == data[i].MA_XA)
					if(data[i].TEN_XA.toUpperCase().indexOf(maXa.toUpperCase())==0  )	
                        fqh.append($('<option selected/>').val(data[i].MA_XA).text(data[i].TEN_XA));
                    else
                        fqh.append($('<option/>').val(data[i].MA_XA).text(data[i].TEN_XA));
				//console.log('val(data[i].MA_XA).text(data[i].TEN_XA): '+i+' '+(data[i].MA_XA)+' '+(data[i].TEN_XA.toUpperCase())+' '+maXa+' '+(data[i].TEN_XA.toUpperCase()).indexOf(maXa)); 	
                });
            } else {
                fqh.append($('<option/>').val('0').text("Chọn xã (TT30)"));
            }
        });
}
function reloadDataSelHuyen(maTinh, maHuyen, maXa) {
        var fqh;
		var maHuyen1;
        fqh = $("#mahuyen_cu_tru");
		url = window.location.origin + '/web_his/lay-ds-huyen-theo-tt30?maTinh=' + maTinh;
        $.getJSON(url, function(data) {
            fqh.empty();
            $("#maxa_cu_tru").empty();
            $("#maxa_cu_tru").append($('<option/>').val('0').text("Chọn xã (TT30)"));
            if (data) {
                if(maHuyen == "")
                    fqh.append($('<option selected/>').val('0').text("Chọn huyện (TT30)"));
                else
                    fqh.append($('<option/>').val('0').text("Chọn huyện (TT30)"));
				
                $.each(data, function(i) {
					//console.log('data:'+(data[i].TEN_HUYEN).indexOf(maHuyen));					
                    if(data[i].TEN_HUYEN.toUpperCase().indexOf(maHuyen.toUpperCase())==0  )
					{
					  fqh.append($('<option selected/>').val(data[i].MA_HUYEN).text(data[i].TEN_HUYEN));
					  maHuyen1=data[i].MA_HUYEN;
					}	
                    else
                        fqh.append($('<option/>').val(data[i].MA_HUYEN).text(data[i].TEN_HUYEN));
					//console.log('val(data[i].MA_HUYEN).text(data[i].TEN_HUYEN): '+i+' '+(data[i].MA_HUYEN)+' '+(data[i].TEN_HUYEN.toUpperCase())+' '+maHuyen+' '+(data[i].TEN_HUYEN.toUpperCase()).indexOf(maHuyen.toUpperCase())); 
                });
            } else {
                fqh.append($('<option/>').val('0').text("Chọn huyện (TT30)"));
            }
            if(maXa != "0") {
                reloadDataSelXa(maHuyen1, maXa);
            }
            if(maXa == "-1") {
                reloadDataSelXa(maHuyen1, "0");
            }
        });
    }
//Run BHYT
function runBHYT()
{
	//MD5
	;(function ($) {

  /*
  * Add integers, wrapping at 2^32. This uses 16-bit operations internally
  * to work around bugs in some JS interpreters.
  */
	function safe_add (x, y) 
	{
		var lsw = (x & 0xFFFF) + (y & 0xFFFF)
		var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
		return (msw << 16) | (lsw & 0xFFFF)
	}

	  /*
	  * Bitwise rotate a 32-bit number to the left.
	  */
	function bit_rol (num, cnt) 
	{
		return (num << cnt) | (num >>> (32 - cnt))
	}

	  /*
	  * These functions implement the four basic operations the algorithm uses.
	  */
	function md5_cmn (q, a, b, x, s, t) 
	{
		return safe_add(bit_rol(safe_add(safe_add(a, q), safe_add(x, t)), s), b)
	}
	function md5_ff (a, b, c, d, x, s, t)
	{
		return md5_cmn((b & c) | ((~b) & d), a, b, x, s, t)
	}
	function md5_gg (a, b, c, d, x, s, t) 
	{
		return md5_cmn((b & d) | (c & (~d)), a, b, x, s, t)
	}
	function md5_hh (a, b, c, d, x, s, t) 
	{
		return md5_cmn(b ^ c ^ d, a, b, x, s, t)
	}
	function md5_ii (a, b, c, d, x, s, t) 
	{
		return md5_cmn(c ^ (b | (~d)), a, b, x, s, t)
	}

	  /*
	  * Calculate the MD5 of an array of little-endian words, and a bit length.
	  */
	function binl_md5 (x, len) 
	{
		/* append padding */
		x[len >> 5] |= 0x80 << (len % 32)
		x[(((len + 64) >>> 9) << 4) + 14] = len

		var i
		var olda
		var oldb
		var oldc
		var oldd
		var a = 1732584193
		var b = -271733879
		var c = -1732584194
		var d = 271733878

		for (i = 0; i < x.length; i += 16) {
		  olda = a
		  oldb = b
		  oldc = c
		  oldd = d

		  a = md5_ff(a, b, c, d, x[i], 7, -680876936)
		  d = md5_ff(d, a, b, c, x[i + 1], 12, -389564586)
		  c = md5_ff(c, d, a, b, x[i + 2], 17, 606105819)
		  b = md5_ff(b, c, d, a, x[i + 3], 22, -1044525330)
		  a = md5_ff(a, b, c, d, x[i + 4], 7, -176418897)
		  d = md5_ff(d, a, b, c, x[i + 5], 12, 1200080426)
		  c = md5_ff(c, d, a, b, x[i + 6], 17, -1473231341)
		  b = md5_ff(b, c, d, a, x[i + 7], 22, -45705983)
		  a = md5_ff(a, b, c, d, x[i + 8], 7, 1770035416)
		  d = md5_ff(d, a, b, c, x[i + 9], 12, -1958414417)
		  c = md5_ff(c, d, a, b, x[i + 10], 17, -42063)
		  b = md5_ff(b, c, d, a, x[i + 11], 22, -1990404162)
		  a = md5_ff(a, b, c, d, x[i + 12], 7, 1804603682)
		  d = md5_ff(d, a, b, c, x[i + 13], 12, -40341101)
		  c = md5_ff(c, d, a, b, x[i + 14], 17, -1502002290)
		  b = md5_ff(b, c, d, a, x[i + 15], 22, 1236535329)

		  a = md5_gg(a, b, c, d, x[i + 1], 5, -165796510)
		  d = md5_gg(d, a, b, c, x[i + 6], 9, -1069501632)
		  c = md5_gg(c, d, a, b, x[i + 11], 14, 643717713)
		  b = md5_gg(b, c, d, a, x[i], 20, -373897302)
		  a = md5_gg(a, b, c, d, x[i + 5], 5, -701558691)
		  d = md5_gg(d, a, b, c, x[i + 10], 9, 38016083)
		  c = md5_gg(c, d, a, b, x[i + 15], 14, -660478335)
		  b = md5_gg(b, c, d, a, x[i + 4], 20, -405537848)
		  a = md5_gg(a, b, c, d, x[i + 9], 5, 568446438)
		  d = md5_gg(d, a, b, c, x[i + 14], 9, -1019803690)
		  c = md5_gg(c, d, a, b, x[i + 3], 14, -187363961)
		  b = md5_gg(b, c, d, a, x[i + 8], 20, 1163531501)
		  a = md5_gg(a, b, c, d, x[i + 13], 5, -1444681467)
		  d = md5_gg(d, a, b, c, x[i + 2], 9, -51403784)
		  c = md5_gg(c, d, a, b, x[i + 7], 14, 1735328473)
		  b = md5_gg(b, c, d, a, x[i + 12], 20, -1926607734)

		  a = md5_hh(a, b, c, d, x[i + 5], 4, -378558)
		  d = md5_hh(d, a, b, c, x[i + 8], 11, -2022574463)
		  c = md5_hh(c, d, a, b, x[i + 11], 16, 1839030562)
		  b = md5_hh(b, c, d, a, x[i + 14], 23, -35309556)
		  a = md5_hh(a, b, c, d, x[i + 1], 4, -1530992060)
		  d = md5_hh(d, a, b, c, x[i + 4], 11, 1272893353)
		  c = md5_hh(c, d, a, b, x[i + 7], 16, -155497632)
		  b = md5_hh(b, c, d, a, x[i + 10], 23, -1094730640)
		  a = md5_hh(a, b, c, d, x[i + 13], 4, 681279174)
		  d = md5_hh(d, a, b, c, x[i], 11, -358537222)
		  c = md5_hh(c, d, a, b, x[i + 3], 16, -722521979)
		  b = md5_hh(b, c, d, a, x[i + 6], 23, 76029189)
		  a = md5_hh(a, b, c, d, x[i + 9], 4, -640364487)
		  d = md5_hh(d, a, b, c, x[i + 12], 11, -421815835)
		  c = md5_hh(c, d, a, b, x[i + 15], 16, 530742520)
		  b = md5_hh(b, c, d, a, x[i + 2], 23, -995338651)

		  a = md5_ii(a, b, c, d, x[i], 6, -198630844)
		  d = md5_ii(d, a, b, c, x[i + 7], 10, 1126891415)
		  c = md5_ii(c, d, a, b, x[i + 14], 15, -1416354905)
		  b = md5_ii(b, c, d, a, x[i + 5], 21, -57434055)
		  a = md5_ii(a, b, c, d, x[i + 12], 6, 1700485571)
		  d = md5_ii(d, a, b, c, x[i + 3], 10, -1894986606)
		  c = md5_ii(c, d, a, b, x[i + 10], 15, -1051523)
		  b = md5_ii(b, c, d, a, x[i + 1], 21, -2054922799)
		  a = md5_ii(a, b, c, d, x[i + 8], 6, 1873313359)
		  d = md5_ii(d, a, b, c, x[i + 15], 10, -30611744)
		  c = md5_ii(c, d, a, b, x[i + 6], 15, -1560198380)
		  b = md5_ii(b, c, d, a, x[i + 13], 21, 1309151649)
		  a = md5_ii(a, b, c, d, x[i + 4], 6, -145523070)
		  d = md5_ii(d, a, b, c, x[i + 11], 10, -1120210379)
		  c = md5_ii(c, d, a, b, x[i + 2], 15, 718787259)
		  b = md5_ii(b, c, d, a, x[i + 9], 21, -343485551)

		  a = safe_add(a, olda)
		  b = safe_add(b, oldb)
		  c = safe_add(c, oldc)
		  d = safe_add(d, oldd)
		}
		return [a, b, c, d]
	}

	  /*
	  * Convert an array of little-endian words to a string
	  */
	  function binl2rstr (input) {
		var i
		var output = ''
		for (i = 0; i < input.length * 32; i += 8) {
		  output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xFF)
		}
		return output
	  }

	  /*
	  * Convert a raw string to an array of little-endian words
	  * Characters >255 have their high-byte silently ignored.
	  */
	  function rstr2binl (input) {
		var i
		var output = []
		output[(input.length >> 2) - 1] = undefined
		for (i = 0; i < output.length; i += 1) {
		  output[i] = 0
		}
		for (i = 0; i < input.length * 8; i += 8) {
		  output[i >> 5] |= (input.charCodeAt(i / 8) & 0xFF) << (i % 32)
		}
		return output
	  }

	  /*
	  * Calculate the MD5 of a raw string
	  */
	  function rstr_md5 (s) {
		return binl2rstr(binl_md5(rstr2binl(s), s.length * 8))
	  }

	  /*
	  * Calculate the HMAC-MD5, of a key and some data (raw strings)
	  */
	  function rstr_hmac_md5 (key, data) {
		var i
		var bkey = rstr2binl(key)
		var ipad = []
		var opad = []
		var hash
		ipad[15] = opad[15] = undefined
		if (bkey.length > 16) {
		  bkey = binl_md5(bkey, key.length * 8)
		}
		for (i = 0; i < 16; i += 1) {
		  ipad[i] = bkey[i] ^ 0x36363636
		  opad[i] = bkey[i] ^ 0x5C5C5C5C
		}
		hash = binl_md5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
		return binl2rstr(binl_md5(opad.concat(hash), 512 + 128))
	  }

	  /*
	  * Convert a raw string to a hex string
	  */
	  function rstr2hex (input) {
		var hex_tab = '0123456789abcdef'
		var output = ''
		var x
		var i
		for (i = 0; i < input.length; i += 1) {
		  x = input.charCodeAt(i)
		  output += hex_tab.charAt((x >>> 4) & 0x0F) +
		  hex_tab.charAt(x & 0x0F)
		}
		return output
	  }

	  /*
	  * Encode a string as utf-8
	  */
	  function str2rstr_utf8 (input) {
		return unescape(encodeURIComponent(input))
	  }

	  /*
	  * Take string arguments and return either raw or hex encoded strings
	  */
	  function raw_md5 (s) {
		return rstr_md5(str2rstr_utf8(s))
	  }
	  function hex_md5 (s) {
		return rstr2hex(raw_md5(s))
	  }
	  function raw_hmac_md5 (k, d) {
		return rstr_hmac_md5(str2rstr_utf8(k), str2rstr_utf8(d))
	  }
	  function hex_hmac_md5 (k, d) {
		return rstr2hex(raw_hmac_md5(k, d))
	  }

	  function md5 (string, key, raw) {
		if (!key) {
		  if (!raw) {
			return hex_md5(string)
		  }
		  return raw_md5(string)
		}
		if (!raw) {
		  return hex_hmac_md5(key, string)
		}
		return raw_hmac_md5(key, string)
	  }

	  if (typeof define === 'function' && define.amd) {
		define(function () {
		  return md5
		})
	  } else if (typeof module === 'object' && module.exports) {
		module.exports = md5
	  } else {
		$.md5 = md5
	  }
	}(this))
	//End MD5
	//Xóa màu-Xóa thông báo
	function resetBHYT()
	{
		  setColorTrue();
		  $("#mod_bhyt_lichsu_msg").css("color","green");
		  $("#mod_bhyt_lichsu_msg").html("<br/>");;
		  $("#part1").empty();
		  $("#part2").html("<br/>");
		  $("#part3").html("<br/>");
		   $('#mod_check_bhyt_hai').html("Kiểm tra BHYT");
		   $('#mod_check_bhyt_hai').removeAttr("disabled");
		  console.log("Reset BHYT");
	}
	function resetTB()
	{
		  $("#part1").empty();
		  $("#part2").html("<br/>");
		  $("#part3").html("<br/>");
		  $("#mod_bhyt_lichsu_msg").html("<br/>");;
	}
	//End màu
	//Dịch lịch sử
	function dichlichsu(cskcb,ngayra,tinhtrang,ketqua,tenbenh)
	{
		tt=function(t) 
		{
			switch (parseInt(t))
			{case 1:return"Ra viện";case 2:return"Chuyển viện";case 3:return"Trốn viện";case 4:return"Xin ra viện";}
		}(tinhtrang);
		kq=function(t) {switch (parseInt(t)){case 1:return"Khỏi";case 2:return"Đỡ";case 3:return"Không thay đổi";case 4:return"Nặng hơn";case 5:return"Tử vong";}}(ketqua);
		dHT=new Date();
		var dk="";
		d="0"+dHT.getDate();d=d.slice(-2);
		m="0"+(dHT.getMonth()+1);m=m.slice(-2);
		y=dHT.getFullYear();
		dHT=y+m+d;
		tenbenh.length>45?chidinh=tenbenh.substring(0,42)+"...)":chidinh=tenbenh+")";
		if(dHT==ngayra.substring(0,8))
		{
			return {msg:"<b>BN đã khám trong ngày lúc "+ngayra.substring(8,10)+":"+ngayra.substring(10,12)+"! </b>"+"(<b style='color: #a76e06;' id='tencskcbls'>"+cskcb+"</b> | "+kq+" | "+tt+" | "+chidinh,kq:0}
		}else return {msg:"<b>Lần khám gần nhất "+ngayra.substring(6,8)+"/"+ngayra.substring(4,6)+"/"+ngayra.substring(0,4)+"</b> (<b style='color: #a76e06;' id='tencskcbls'>"+cskcb+"</b> | "+kq+" | "+tt+" | "+chidinh,kq:1}
		 
	}
	function dichlichsuCT(cskcb,ngayvao,tinhtrang,ketqua,tenbenh,ngayra,stt,tencskcb)
	{
		tt=function(t) 
		{switch (parseInt(t))
			{case 1:return"Ra viện";case 2:return"Chuyển viện";case 3:return"Trốn viện";case 4:return"Xin ra viện";}	  
		}(tinhtrang);
		kq=function(t) {switch (parseInt(t)){case 1:return"Khỏi";case 2:return"Đỡ";case 3:return"Không thay đổi";case 4:return"Nặng hơn";case 5:return"Tử vong";}}(ketqua);
		rs="<tr><td>"+stt+"</td><td>"+ngayvao.substring(6,8)+"/"+ngayvao.substring(4,6)+"/"+ngayvao.substring(0,4)+" "+ngayvao.substring(8,10)+":"+ngayvao.substring(10,12)+"</td>";
		rs+="<td>"+ngayra.substring(6,8)+"/"+ngayra.substring(4,6)+"/"+ngayra.substring(0,4)+" "+ngayra.substring(8,10)+":"+ngayra.substring(10,12)+"</td>";
		rs+="<td>"+tenbenh+"</td>";
		//rs+="<td>"+cskcb+"</td>";
		rs+="<td>"+cskcb+" - "+tencskcb+"</td>";
		rs+="<td>"+kq+"</td>";
		rs+="<td>"+tt+"</td></tr>";
		return rs;
	}
		function dichlichsuKT(cskcb,thoigian,mathongbao,thongbao,stt)
		{
			rs="<tr><td>"+stt+"</td><td>"+cskcb+"</td>";
			rs+="<td>"+thoigian.substring(6,8)+"/"+thoigian.substring(4,6)+"/"+thoigian.substring(0,4)+" "+thoigian.substring(8,10)+":"+thoigian.substring(10,12)+"</td>";
			rs+="<td>"+mathongbao+" - "+dichketqua(mathongbao).msg+"</td>";
			rs+="<td>"+thongbao+"</td></tr>";
			return rs;
		}
	//End lịch sử
	//Dịch kết quả
	  function dichketqua (value)
	  {
		  switch (value)
		  {
			case "000": return {kq:1,msg:"Thẻ còn giá trị sử dụng"};
			case "001": return {kq:2,msg:"Thẻ do BHXH Bộ Quốc Phòng quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân"};
			case "002": return {kq:2,msg:"Thẻ do BHXH Bộ Công An quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân"};
			case "003": return {kq:2,msg:"Thẻ cũ hết giá trị sử dụng nhưng đã được cấp thẻ mới"};
			case "003.1": return {kq:2,msg:"Thẻ đã được gia hạn"};
			case "004": return {kq:1,msg:"Thẻ cũ còn giá trị sử dụng nhưng đã được cấp thẻ mới"};
			case "010": return {kq:0,msg:"Thẻ hết giá trị sử dụng"};
			case "051": return {kq:0,msg:"Mã thẻ không đúng"};
			case "052": return {kq:0,msg:"Mã tỉnh cấp thẻ(kí tự thứ 4,5 của mã thẻ) không đúng"};
			case "053": return {kq:0,msg:"Mã quyền lợi thẻ(kí tự thứ 3 của mã thẻ) không đúng"};
			case "050": return {kq:0,msg:"Không thấy thông tin thẻ bhyt"};
			case "060": return {kq:3,msg:"Thẻ sai họ tên"};
			case "061": return {kq:3,msg:"Thẻ sai họ tên(đúng kí tự đầu)"};
			case "070": return {kq:1,msg:"Thẻ sai ngày sinh"};
			case "100": return {kq:0,msg:"Lỗi khi lấy dữ liệu sổ thẻ"};
			case "101": return {kq:0,msg:"Lỗi server"};
			case "110": return {kq:0,msg:"Thẻ đã thu hồi"};
			case "120": return {kq:0,msg:"Thẻ đã báo giảm"};
			case "121": return {kq:0,msg:"Thẻ đã báo giảm. Giảm chuyển ngoại tỉnh"};
			case "122": return {kq:0,msg:"Thẻ đã báo giảm. Giảm chuyển nội tỉnh"};
			case "123": return {kq:0,msg:"Thẻ đã báo giảm. Thu hồi do tăng lại cùng đơn vị"};
			case "124": return {kq:0,msg:"Thẻ đã báo giảm. Ngừng tham gia"};
			case "130": return {kq:2,msg:"Trẻ em không xuất trình thẻ"};
			case "205": return {kq:0,msg:"Lỗi sai định dạng tham số truyền vào"};
			case "401": return {kq:0,msg:"Lỗi xác thực tài khoản"};
			default: return {kq:0,msg:"Không xác định"};
		  }
  
	}
	//End kết quả
	  //0:sai - 1: đúng- 2: cảnh báo
	  function editColorTrue(id,value)
	  {
		  switch (value){
		 case 0:
			$(id).css("background","#fbd2d2"); break;
		 case 1:
			$(id).css("background","#ddf5dd"); break; 		 
		 case 2:
			$(id).css("background","#f9d5a1"); break; 
		 default: $(id).css("background","");
		  }
		if(!$('#sobhyt').prop("disabled")){ setTimeout(function(){ $(id).css("background",""); }, 2000)};
	  }
	    //0: sai thẻ -1:đúng -2:cảnh báo- 3:sai họ tên -4: xóa màu
		  function setColorTrue(value){
				switch(value){
					case 0:{
					editColorTrue("#sobhyt",0);$("#part1").css("color","red");
					break;
					}
					case 1:{
					editColorTrue("#hoten",1);editColorTrue("#sobhyt",1);editColorTrue("#tungay",1);editColorTrue("#denngay",1);editColorTrue("#noidangky",1);editColorTrue("#cbgioitinh",1);editColorTrue("#namsinh",1);editColorTrue("#diachi",1);editColorTrue("#manoidoituong",1);$("#part1").css("color","darkgreen");
					editColorTrue("#thoigian_du5namlientuc",1);
					break;
					}
					case 2:{
					editColorTrue("#sobhyt",2);$("#part1").css("color","#a76e06");
					break;
					}
					case 3:{
					editColorTrue("#hoten",0);editColorTrue("#sobhyt",1);$("#part1").css("color","red");
					break;
					}
					default:{
					editColorTrue("#hoten");editColorTrue("#sobhyt");editColorTrue("#tungay");editColorTrue("#denngay");editColorTrue("#noidangky");editColorTrue("#cbgioitinh");editColorTrue("#namsinh");editColorTrue("#diachi");editColorTrue("#manoidoituong"); $("#part1").css("color","red");editColorTrue("#thoigian_du5namlientuc");
					}
				}
		  }
	  //End màu
	  //Remove Ede
	function removeEde(str) 
	{
		str = str.replace(/Ê̆|Ĕ|ê̆|ĕ/g,"E");
		str = str.replace(/Ĭ|ĭ/g,"I");
		str = str.replace(/Ŏ|Ơ̆|Ô̆|ŏ|ơ̆|ô̆/g,"O");
		str = str.replace(/Ŭ|Ư̆|ŭ|ư̆/g,"U");
		str = str.replace(/Ƀ|ƀ/g,"B");
		str = str.replace(/Č|č/g,"C");
		return str;
	}
	  //End remove Ede
	  
	  //Kiểm tra thẻ
	
	var taikhoan="";
	var matkhau="";
	dmnoidangky="";
	dmndk=[];
	$.get(window.location.origin+"/web_his/ds_noitiepnhan?_search=false&nd=1547738873909&rows=200000&page=1&sidx=&sord=asc").done(function( d ) 
	{
		dmnoidangky=d;
		for(i=0;i<dmnoidangky.length;i++){dmndk[dmnoidangky[i].MA_NOITIEPNHAN]=dmnoidangky[i].TEN_NOITIEPNHAN};
	});
	$.get(window.location.origin+"/web_his/Cau_Hinh_Tham_So_XuatXMLBHYT",function(t){taikhoan=$(t).find("#motathamso123").val(),matkhau=md5($(t).find("#motathamso124").val())});
	//Kiểm tra trong chức năng tiếp nhận
	if ((document.URL.indexOf('tiepnhan') != -1) )
	{
		$('#tb_giahanthe').css("display","none !important");
		$('#noidangky').keypress(function (e){if (e.keyCode==13&&$('#noidangky').val()!="")
		{
			if(taikhoan.substring(0,5)=='66018'||taikhoan.substring(0,5)=='66106'||taikhoan.substring(0,5)=='66107'||taikhoan.substring(0,5)=='66108'||taikhoan.substring(0,5)=='66109'||taikhoan.substring(0,5)=='66110'||taikhoan.substring(0,5)=='66223'||taikhoan.substring(0,5)=='66217')
			{
				if($('#noidangky').val() == '66018'||$('#noidangky').val() == '66106'||$('#noidangky').val() == '66107'||$('#noidangky').val() == '66108'||$('#noidangky').val() == '66109'||$('#noidangky').val() == '66110'||$('#noidangky').val() == '66223'||$('#noidangky').val() == '66217')
				{
					$('#thongtuyen_bhxh').prop('checked', false);
					$('#dungtuyen').prop('checked', true);
				}
				else
				{
					if($('#noidangky').val().substring(0,2)=='66')
					{
						if($('#noidangky').val() == '66234'||$('#noidangky').val() == '66001'||$('#noidangky').val() == '66235'||$('#noidangky').val() == '66232'||$('#noidangky').val() == '66233'||$('#noidangky').val() == '66236'||$('#noidangky').val() == '66002'||$('#noidangky').val() == '66069')
							{
								$('#thongtuyen_bhxh').prop('checked', false);
								$('#dungtuyen').prop('checked', false);										
							}
							else
							{
								$('#thongtuyen_bhxh').prop('checked', true);
								$('#dungtuyen').prop('checked', true);
							}
					}
					else
					{
						if($('#noidangky').val() =='97511')
						{
							$('#thongtuyen_bhxh').prop('checked', true);
							$('#dungtuyen').prop('checked', true);
						}
						else
						{
							$('#thongtuyen_bhxh').prop('checked', false);
							$('#dungtuyen').prop('checked', false);
						}
					}
				}
			}
		}
		});

		$('#noidangky').keyup(function ()
		{
			if(taikhoan.substring(0,5)=='66018'||taikhoan.substring(0,5)=='66106'||taikhoan.substring(0,5)=='66107'||taikhoan.substring(0,5)=='66108'||taikhoan.substring(0,5)=='66109'||taikhoan.substring(0,5)=='66110'||taikhoan.substring(0,5)=='66223'||taikhoan.substring(0,5)=='66217')
			{
				if($('#noidangky').val() == '66018'||$('#noidangky').val() == '66106'||$('#noidangky').val() == '66107'||$('#noidangky').val() == '66108'||$('#noidangky').val() == '66109'||$('#noidangky').val() == '66110'||$('#noidangky').val() == '66223'||$('#noidangky').val() == '66217'){
					$('#thongtuyen_bhxh').prop('checked', false);
					$('#dungtuyen').prop('checked', true);
				}
				else
				{
					if($('#noidangky').val().substring(0,2)=='66')
					{
						if($('#noidangky').val() == '66234'||$('#noidangky').val() == '66001'||$('#noidangky').val() == '66235'||$('#noidangky').val() == '66232'||$('#noidangky').val() == '66233'||$('#noidangky').val() == '66236'||$('#noidangky').val() == '66002'||$('#noidangky').val() == '66069')
						{
							$('#thongtuyen_bhxh').prop('checked', false);
							$('#dungtuyen').prop('checked', false);										
						}
						else
						{
							$('#thongtuyen_bhxh').prop('checked', true);
							$('#dungtuyen').prop('checked', true);
						}
					}
					else
					{
						if($('#noidangky').val() =='97511')
							{
								$('#thongtuyen_bhxh').prop('checked', true);
								$('#dungtuyen').prop('checked', true);
							}
							else
							{
								$('#thongtuyen_bhxh').prop('checked', false);
								$('#dungtuyen').prop('checked', false);
							}
					}
				}

			}
		});
		function disluu()
		{
			if($('#sobhyt').val()!="")
			{
				 $('#luu').attr("disabled", true);
				 $('#luu').addClass('button_disabled');
				 $('#luu').removeClass('button_shadow');
			}
			else
			{
				 $('#luu').removeAttr("disabled");
				 $('#luu').addClass('button_shadow');
				 $('#luu').removeClass('button_disabled');
			}
		}
		//Khóa nút lưu
		$('#sobhyt').keyup(function(){
			disluu();			
		});
		$('#mayte').keypress(function (e){if (e.keyCode==13) 
			var url = "https://yte-daklak.vnpthis.vn/web_his/timkiembntheobhyt?bhyt=0&mabn="+$('#mayte').val();
			$.getJSON(url, function (result) 
			{
				$.each(result, function (i, field) 
				{														
					if (field != null && field.SO_THE_BAOHIEM_YTE!=null)
					{
						$('#luu').attr("disabled", true);
						$('#luu').addClass('button_disabled');
						$('#luu').removeClass('button_shadow');			
					}

				});
			});
		});
		$("#tegt").change(function () 
		{
			var giaytote = this.value;
			$('#tegiayto').val(giaytote);
		});
		//End khóa
		$("#tabtiepnhan").append('<div id="mod_bhyt_section"><div id="mod_bhyt_btn" style="float:right;"></div></div><div style="clear:both; margin: 5px; text-align: center;" id="mod_bhyt_message"><span id="statusMessage"><span id="part1" style="font-size:16px;"></span><span id="part2" style="color: rgb(0, 112, 192); font-weight:bold;text-align: left;"></span><span id="part3" style="color: rgb(0, 176, 105);"></span></span><div style="clear:both; margin-top: 0px; text-align: center;" id="mod_bhyt_lichsu_msg" /><div><input id="tmpnamsinh" style="display:none;"/><input id="tmptungay" style="display:none;"/><input id="tmpdenngay" style="display:none;"/><input id="tmpthoigian_du5namlientuc" style="display:none;"/></div>');
		//var script = document.createElement("script");
		//script.innerHTML = '$("#tmpnamsinh").on("click",function (){if($("#tmpnamsinh").val()!=""){$("#namsinh").val($("#tmpnamsinh").val());$("#namsinh").change();};if($("#tmptungay").val()!=""){$("#tungay").val($("#tmptungay").val());$("#tungay").change();};if($("#tmpdenngay").val()!=""){$("#denngay").val($("#tmpdenngay").val());$("#denngay").change();};if($("#tmpthoigian_du5namlientuc").val()!=""){$("#thoigian_du5namlientuc").val($("#tmpthoigian_du5namlientuc").val());$("#thoigian_du5namlientuc").change();};});';
		//document.head.appendChild(script);
		//script.src = chrome.extension.getURL(file);
		$("#baohiem5nam_label").parent().append('<button id="mod_check_bhyt_hai" style="margin:3px; padding:5px; border-radius:2px;font-weight:bold;" type="button" class="custom-btn btn-9"><span class="glyphicon glyphicon-search"></span>Kiểm tra BHYT</button>');
		$("body").append('<div id="mod_lichsuct" style="display:none;"><h1>Lịch sử 10 lần gần nhất (click bất kỳ trong bảng để thoát)</h1><table id="mod_lichsukcb"></table><table id="mod_lichsukt"></table></div>');
		$.get(window.location.origin+"/web_his/Cau_Hinh_Tham_So_XuatXMLBHYT",function(t)
		{
			taikhoan=$(t).find("#motathamso123").val(),matkhau=md5($(t).find("#motathamso124").val())
		});
		console.log("Khởi tạo thành công");
		$lankiemtra = 0;
		function checkthe(hoten, sothe)
		{
			$lankiemtra = $lankiemtra + 1;
			console.log("START_Check BHYT");
			resetBHYT();
			var hoten = hoten;
			var sobhyt = sothe;
			$("#part1").html("<b>Đang quét thẻ</b>");
			//var hoten=removeEde($("#hoten").val()),sobhyt=$("#sobhyt").val();
			$('#mod_check_bhyt_hai').html("Đang KT ..."+sobhyt.slice(-3));
			$('#mod_check_bhyt_hai').attr("disabled", true);
			$("#chinamsinh").prop("checked")?namsinh=$("#namsinh").val().substring(6,10):namsinh=$("#namsinh").val();
			if (namsinh==""||namsinh.search("d")!=-1||namsinh.search("m")!=-1||namsinh.search("y")!=-1) namsinh="1992";
			$.post( "https://egw.baohiemxahoi.gov.vn/api/token/take", { username: taikhoan, password:matkhau}).done(function( dtake ) 
			{
				if(dtake.maKetQua==200){
					$.post("https://egw.baohiemxahoi.gov.vn/api/egw/NhanLichSuKCB2018?token="+dtake.APIKey.access_token+"&id_token="+dtake.APIKey.id_token+"&username="+taikhoan+"&password="+matkhau,{maThe:sobhyt,hoTen:hoten,ngaySinh:namsinh}).done(function( d ) 
					{
						
						if(d.maKetQua=="003")
						{
							var p3= '<button id="nhapthemoi" class="btn" style="margin: 2px; padding: 2px 3px;">Nhập thẻ mới</button><button id="nhaphanmoi" class="btn" style="margin: 2px; padding: 2px 3px;">Nhập hạn mới</button>';
							//$("#sobhyt").val(d.maTheMoi);window.location = 'javascript:$("#sobhyt").keypress()';checkthe($('#hoten').val(),$('#sobhyt').val());return 0;
							//d.maKetQua="003.1";
							//d.gtTheTu=d.gtTheTuMoi;
							//d.gtTheDen=d.gtTheDenMoi;
						}
						
						//trường hợp ketqua =000 nhưng có hạn thẻ mới
						if(d.gtTheTuMoi!=null && d.gtTheDenMoi!=null)
						{
							//trường hợp ketqua =004 nhưng có hạn thẻ mới
							if(d.maKetQua=="004")
							{
								$("#tungay").val(d.gtTheTu);
								$('#tungay').hover(function(){
								$('#tungay').val(d.gtTheTu);
								},function(){
								$('#tungay').val(d.gtTheTu);
								});
							}
							else
							{
								$("#tungay").val(d.gtTheTuMoi);
								$('#tungay').hover(function(){
										$('#tungay').val(d.gtTheTuMoi);
									},function(){
										$('#tungay').val(d.gtTheTuMoi);
									});
							}
															
							$("#denngay").val(d.gtTheDenMoi);
							$('#denngay').hover(function(){
									$('#denngay').val(d.gtTheDenMoi);
								},function(){
									$('#denngay').val(d.gtTheDenMoi);
								});
						}
						else
						{
							if(d.maKetQua=="001"||d.maKetQua=="002")
							{
								
							}
							else
							{
								$("#tungay").val(d.gtTheTu);
								$('#tungay').hover(function(){
									$('#tungay').val(d.gtTheTu);
									},function(){
									$('#tungay').val(d.gtTheTu);
									});
								$("#denngay").val(d.gtTheDen);
								$('#denngay').hover(function(){
										$('#denngay').val(d.gtTheDen);
									},function(){
										$('#denngay').val(d.gtTheDen);
									});
							}
						}
						$('#thoigian_du5namlientuc').val(d.ngayDu5Nam);
						$('#thoigian_du5namlientuc').hover(function(){
									$('#thoigian_du5namlientuc').val(d.ngayDu5Nam);
								},function(){
									$('#thoigian_du5namlientuc').val(d.ngayDu5Nam);
								});
						//kết thúc					
						$('#mod_check_bhyt_hai').html("Đã KT "+sobhyt.slice(0,3)+"..."+sobhyt.slice(-3));
						$('#mod_check_bhyt_hai').removeAttr("disabled");
						kqbh=dichketqua(d.maKetQua);
						if (d.maThe==null)
						{
							var p1="<b>"+kqbh.msg+"! </b>";
							$("#part1").html(p1);
							setColorTrue(kqbh.kq);
							console.log("END_Không có thông tin thẻ chỉ hiện thông báo");
						}else
						{
							if(d.maKetQua=="070")
							{
								switch (d.ngaySinh.length)
								{
									case 4:$("#chinamsinh").prop("checked", true);$("#namsinh").val("01/01/"+d.ngaySinh);tempngaysinh="01/01/"+d.ngaySinh;break;
									case 7:$("#chinamsinh").prop("checked", true);$("#namsinh").val("01/"+d.ngaySinh);tempngaysinh="01/"+d.ngaySinh;break;
									case 10:$("#chinamsinh").prop("checked", false);$("#namsinh").val(d.ngaySinh);tempngaysinh=d.ngaySinh;break;
									default:editColorTrue("#namsinh",1);
								}
								$("#tmpnamsinh").val(tempngaysinh);										
								$("#tmpnamsinh").click()
								checkthe($('#hoten').val(),$('#sobhyt').val());
								return 0;
							}
							var p1="<b>"+kqbh.msg+'! </b>';
							var p2=d.ghiChu;
							var p3="";	
							if(d.maKetQua=="003"&&d.maThe!=d.maTheMoi&&!$('#sobhyt').prop("disabled"))
							{
								var p3= '</br><button id="nhapthemoi" class="btn" style="margin: 2px; padding: 2px 3px;">Nhập thẻ mới</button><button id="nhaphanmoi" class="btn" style="margin: 2px; padding: 2px 3px;">Nhập hạn mới</button>';
								//$("#sobhyt").val(d.maTheMoi);window.location = 'javascript:$("#sobhyt").keypress()';checkthe($('#hoten').val(),$('#sobhyt').val());return 0;
								//d.maKetQua="003.1";
								//d.gtTheTu=d.gtTheTuMoi;
								//d.gtTheDen=d.gtTheDenMoi;
							}							
							//if(d.maKetQua=="003"&&!$('#sobhyt').prop("disabled"))
							//{
								//var p3= '<button id="nhapthemoi" class="btn" style="margin: 2px; padding: 2px 3px;">Nhập thẻ mới</button><button id="nhaphanmoi" class="btn" style="margin: 2px; padding: 2px 3px;">Nhập hạn mới</button>';
							//	$("#sobhyt").val(d.maTheMoi);window.location = 'javascript:$("#sobhyt").keypress()';checkthe($('#hoten').val(),$('#sobhyt').val());return 0;
							//}
							$("#part1").html(p1);
							$("#part2").html(p2);
							$("#part3").html(p3);
							$("#nhapthemoi").on("click",function ()
							{
								$("#sobhyt").val(d.maTheMoi);
								checkthe($('#hoten').val(),$('#sobhyt').val());return 0;
							});
							//kiem tra lich su kham
							var lichsu_msg="";
							var lichsu_num='  <span id="hienlichsu" style="cursor: pointer;text-decoration:underline;">';
							var lichsu_kcb="<caption>Lịch sửa khám bệnh</caption><tr><th>STT</th><th>Ngày vào viện</th><th>Ngày ra viện</th><th>Tên Bệnh</th><th>Tên CSKCB</th><th>Kết quả</th><th>Tình trạng</th></tr>";
							var lichsu_kt="<caption>Lịch sửa kiểm tra thẻ trong ngày</caption><tr><th>STT</th><th>User KT</th><th>Ngày kiểm tra</th><th>Mã thông báo</th><th>Thông báo</th></tr>";
							$("#mod_lichsukt").html("");
							$("#mod_lichsukcb").html("");
							if (d.dsLichSuKCB2018!=null)
							{
								ls=dichlichsu(d.dsLichSuKCB2018[0].maCSKCB,d.dsLichSuKCB2018[0].ngayRa,d.dsLichSuKCB2018[0].tinhTrang,d.dsLichSuKCB2018[0].kqDieuTri,d.dsLichSuKCB2018[0].tenBenh);
								lichsu_msg=ls.msg;
								lichsu_num+='LSKB('+d.dsLichSuKCB2018.length+')';
								if(!ls.kq)$("#mod_bhyt_lichsu_msg").css("color","red");
									
								for (i=0;i<d.dsLichSuKCB2018.length&&i<10;i++)
								{
									lichsu_kcb+=dichlichsuCT(d.dsLichSuKCB2018[i].maCSKCB,d.dsLichSuKCB2018[i].ngayVao,d.dsLichSuKCB2018[i].tinhTrang,d.dsLichSuKCB2018[i].kqDieuTri,d.dsLichSuKCB2018[i].tenBenh,d.dsLichSuKCB2018[i].ngayRa,i+1,dmndk[d.dsLichSuKCB2018[i].maCSKCB]);
											
								}
										//lichsu_kcb="";
								$("#mod_lichsukcb").html(lichsu_kcb);
							};
							if (d.dsLichSuKT2018!=null&&d.dsLichSuKT2018.length>0)
							{
								lichsu_num+='LSKT('+d.dsLichSuKT2018.length+')';
								for (i=0;i<d.dsLichSuKT2018.length;i++)
								{
									lichsu_kt+=dichlichsuKT(d.dsLichSuKT2018[i].userKT,d.dsLichSuKT2018[i].thoiGianKT,d.dsLichSuKT2018[i].maLoi,d.dsLichSuKT2018[i].thongBao,i+1);
								}
								$("#mod_lichsukt").html(lichsu_kt);
							};
									
							$("#mod_bhyt_lichsu_msg").html(lichsu_msg+lichsu_num+"</span>");
							if (d.dsLichSuKCB2018!=null)
							{
								$("#tencskcbls").prop('title',dmndk[d.dsLichSuKCB2018[0].maCSKCB]);								
							}
							$("#hienlichsu").on("click",function(){$("#mod_lichsuct").show();$("body").css("overflow","hidden"); });
							$("#mod_lichsuct").on("click",function(){$("#mod_lichsuct").hide();$("body").css("overflow","scroll");});
									//chinh sua
							if(!$('#hoten').prop("disabled"))
							{
								//$("#hoten").val(d.hoTen.toUpperCase());
								//$("#sobhyt").val(d.maThe);window.location = 'javascript:$("#sobhyt").keypress()';$("#tungay").val(d.gtTheTu);$("#denngay").val(d.gtTheDen);$("#noidangky").val(d.maDKBD);
								$("#noidangky").val(d.maDKBD);
								$("#noidangky_hienthi").val(dmndk[d.maDKBD]);
								$('#noidangky').keyup();										
								if("Nam"==d.gioiTinh)
								{
									$("#cbgioitinh").val("true");$("#gioitinh").val("1");
											
								}else 
								{								
									$("#cbgioitinh").val("false");$("#gioitinh").val("0");
								}
								switch (d.ngaySinh.length)
								{
									case 4:$("#chinamsinh").prop("checked", true);$("#namsinh").val("01/01/"+d.ngaySinh);tempngaysinh="01/01/"+d.ngaySinh;break;
									case 7:$("#chinamsinh").prop("checked", true);$("#namsinh").val("01/"+d.ngaySinh);tempngaysinh="01/"+d.ngaySinh;break;
									case 10:$("#chinamsinh").prop("checked", false);$("#namsinh").val(d.ngaySinh);tempngaysinh=d.ngaySinh;break;
									default : editColorTrue("#namsinh",1);
								}				
								$("#diachi").val(d.diaChi);$("#manoidoituong").val(d.maKV);
								//địa chỉ
								var tinh_tp = d.diaChi.trim();
								//const lastIndex;								
								const lastIndex = tinh_tp.lastIndexOf(",");								
								var ten_tinh_tp = tinh_tp.slice(lastIndex + 1).trim();
								switch(ten_tinh_tp) {
									case "CẦN THƠ": ten_tinh_tp="Thành phố Cần Thơ";
										break;
									case "ĐÀ NẴNG": ten_tinh_tp="Thành phố Đà Nẵng";
										break;
									case "HÀ NỘI": ten_tinh_tp="Thành phố Hà Nội";
										break;
									case "HẢI PHÒNG": ten_tinh_tp="Thành phố Hải Phòng";
										break;	
									case "HỒ CHÍ MINH": ten_tinh_tp="Thành phố Hồ Chí Minh";
										break;	
																
									case "Cần Thơ": ten_tinh_tp="Thành phố Cần Thơ";
										break;
									case "Đà Nẵng": ten_tinh_tp="Thành phố Đà Nẵng";
										break;
									case "Hà Nội": ten_tinh_tp="Thành phố Hà Nội";
										break;
									case "Hải Phòng": ten_tinh_tp="Thành phố Hải Phòng";
										break;	
									case "Hồ Chí Minh": ten_tinh_tp="Thành phố Hồ Chí Minh";
										break;																	
									default: ten_tinh_tp=ten_tinh_tp;
									}
									console.log('ten_tinh_tp: '+ten_tinh_tp); 
														
									var quan_huyen = tinh_tp.slice(0, lastIndex);
									
									//const lastIndex_q;
									
									const lastIndex_q = quan_huyen.lastIndexOf(",");
									
									const ten_quan_huyen = quan_huyen.slice(lastIndex_q + 1).trim();
									console.log('ten_quan_huyen: '+ten_quan_huyen); 
													
									var xa_phuong = quan_huyen.slice(0, lastIndex_q);
									//const lastIndex_x;									
									const lastIndex_x = xa_phuong.lastIndexOf(",");									
									const ten_xa_phuong = xa_phuong.slice(lastIndex_x + 1).trim();
									console.log('ten_xa_phuong: '+ten_xa_phuong); 
														
									var dd = document.getElementById('matinh_cu_tru');
									for (var i = 0; i < dd.options.length; i++) {
															//console.log('dd.options[i].text: '+i+' '+dd.options[i].text); 
										if (dd.options[i].text === ten_tinh_tp) {
											dd.selectedIndex = i;
											var dd1 = document.getElementById('select2-matinh_cu_tru-container');
											dd1.setAttribute('title', ten_tinh_tp); 
											dd1.textContent = ten_tinh_tp;											
											reloadDataSelHuyen(dd.value,ten_quan_huyen,ten_xa_phuong);
																	//console.log('dd.options[i]: '+i+' '+dd.options[i].text); 
											break;
										}
									}
								setColorTrue(kqbh.kq);
								console.log("END_Kiểm tra vừa chỉnh sửa hoàn tất");
								$("#tmpnamsinh").val(tempngaysinh);
								$("#tmptungay").val(d.gtTheTu);
								$("#tmpdenngay").val(d.gtTheDen);
								$("#tmpthoigian_du5namlientuc").val(d.ngayDu5Nam);
								$("#tmpnamsinh").click();
								$("#nhaphanmoi").on("click",function ()
								{
									$("#tmpdenngay").val(d.gtTheDenMoi);
									$("#tmpnamsinh").click();
									$("#denngay").css("background","#a76e06");
								});
								//blockday("#tungay",$("#tungay").val());
								//blockday("#denngay",$("#denngay").val());
								//blockday("#namsinh",$("#namsinh").val());
							}else 
							{
								$("#tungay").val()!=d.gtTheTu?editColorTrue("#tungay",0):editColorTrue("#tungay",1);
								$("#denngay").val()!=d.gtTheDen?editColorTrue("#denngay",0):editColorTrue("#denngay",1);
								$("#thoigian_du5namlientuc").val()!=d.ngayDu5Nam?editColorTrue("#thoigian_du5namlientuc",0):editColorTrue("#thoigian_du5namlientuc",1);
								$("#noidangky").val()!=d.maDKBD?editColorTrue("#noidangky",0):editColorTrue("#noidangky",1);
								$("#diachi").val()!=d.diaChi?editColorTrue("#diachi",0):editColorTrue("#diachi",1);
								$("#manoidoituong").val()!=d.maKV?editColorTrue("#manoidoituong",0):editColorTrue("#manoidoituong",1);
								if("Nam"==d.gioiTinh)
								{
									($("#cbgioitinh").val()!="true"||$("#gioitinh").val()!="1")?editColorTrue("#cbgioitinh",0):editColorTrue("#cbgioitinh",1);
								}else 
								{
									($("#cbgioitinh").val()!="false"||$("#gioitinh").val()!="0")?editColorTrue("#cbgioitinh",0):editColorTrue("#cbgioitinh",1);;
								}
								switch (d.ngaySinh.length)
								{
									case 4: (!$("#chinamsinh").prop("checked")||$("#namsinh").val().substring(6,10)!=d.ngaySinh)?editColorTrue("#namsinh",0):editColorTrue("#namsinh",1);break;
									case 7: (!$("#chinamsinh").prop("checked")||$("#namsinh").val().substring(4,10)!=d.ngaySinh)?editColorTrue("#namsinh",0):editColorTrue("#namsinh",1);break;
									case 10:($("#chinamsinh").prop("checked")||$("#namsinh").val()!=d.ngaySinh)?editColorTrue("#namsinh",0):editColorTrue("#namsinh",1);break;
									default : editColorTrue("#namsinh",0);
								}
										
								if(kqbh.kq==1)
								{
									$("#part1").css("color","darkgreen");
								}
								if(kqbh.kq==2){
									$("#part1").css("color","#a76e06");
								}
								console.log("END_Không mở sửa thông tin chỉ so khớp dữ liệu");
							}
						}
								//Kiểm tra thẻ 10 số
						if($("#sobhyt").val().length==10)
						{
							if (d.maThe!=null)
							{
								$("#sobhyt").val(d.maThe);
								var madt = d.maThe.substring(0, 3);
								var url = "https://yte-daklak.vnpthis.vn/web_his/kiemtrathebhyt?madt=" + madt.toUpperCase();
									$.ajax({
											url: url,
													//async: false
											}).done(function (data)
											{
												var arr = data.toString().split(":");
												$("#chuoinhandang").val(madt.toUpperCase());
												$("#doituongthe").val(arr[0]);
												$("#tlmiengiam").val(arr[1]);
											});

							}
									//$("#sobhyt").val(d.maThe);
						}
						if($("#sobhyt").val().length == 15)
						{
							var url = "https://yte-daklak.vnpthis.vn/web_his/timkiembntheobhyt?bhyt=" + d.maThe + "&mabn=0";
							$.getJSON(url, function (result) 
							{
								$.each(result, function (i, field) 
								{														// ngày 21/03/2017 quét thẻ chỉ lấy thông tin thẻ không lấy thông tin db
									if (field != null)
									{
										//if(field.TEN_BENH_NHAN == d.hoTen)
										//{	
										$('#mayte').val(field.MA_BENH_NHAN);
										//$('#manoidoituong').val(field.MANOI_SINH_SONG);
										$('#nguoilienhe').val(field.NGUOI_LIEN_HE);
										$('#cmnd_nguoilh').val(field.CMND_NGUOILH);
										$('#mapx').val(field.MA_PHUONG_XA);
										$('#dantoc').val(field.MA_DANTOC);
										$('#cbdantoc').val(field.MA_DANTOC);
										$('#nghenghiep').val(field.MA_NGHE_NGHIEP);
										$('#cbnghenghiep').val(field.MA_NGHE_NGHIEP);
										$('#idnhankhau').val(field.ID_NHAN_KHAU);
										$('#chinamsinh').prop('checked', field.HIEN_NAMSINH == "1" ? true : false);
															//}															
									}//end 21/03/2017
								});
							});
						}
						//Kiểm tra CCCD
						if($("#sobhyt").val().length == 12)
						{
							if (d.maThe!=null)
							{
								$("#sobhyt").val(d.maThe).keyup();
								$("#socmt").val(sobhyt);
								var madt = d.maThe.substring(0, 3);
								var url = "https://yte-daklak.vnpthis.vn/web_his/kiemtrathebhyt?madt=" + madt.toUpperCase();
								$.ajax({
									url: url,
								}).done(function (data)
								{
									var arr = data.toString().split(":");
									$("#chuoinhandang").val(madt.toUpperCase());
									$("#doituongthe").val(arr[0]);
									$("#tlmiengiam_dungtuyen").val(arr[1]);
									$("#tlmiengiam").val(arr[1]);
								});
								var url = "https://yte-daklak.vnpthis.vn/web_his/timkiembntheobhyt?bhyt=" + d.maThe + "&mabn=0";
								$.getJSON(url, function (result) 
								{
									$.each(result, function (i, field) 
									{
										// ngày 21/03/2017 quét thẻ chỉ lấy thông tin thẻ không lấy thông tin db
										if (field != null)
										{
											//if(field.TEN_BENH_NHAN == d.hoTen)
											//{	
											$('#mayte').val(field.MA_BENH_NHAN);
											//$('#manoidoituong').val(field.MANOI_SINH_SONG);
											$('#nguoilienhe').val(field.NGUOI_LIEN_HE);
											$('#cmnd_nguoilh').val(field.CMND_NGUOILH);
											$('#mapx').val(field.MA_PHUONG_XA);
											$('#dantoc').val(field.MA_DANTOC);
											$('#cbdantoc').val(field.MA_DANTOC);
											$('#nghenghiep').val(field.MA_NGHE_NGHIEP);
											$('#cbnghenghiep').val(field.MA_NGHE_NGHIEP);
											$('#idnhankhau').val(field.ID_NHAN_KHAU);
											$('#chinamsinh').prop('checked', field.HIEN_NAMSINH == "1" ? true : false);
											//}															
										}					
														
														//end 21/03/2017
									});
								});
							}
						}
									//
						if(d.maKetQua=="003"||d.maKetQua=="000"||d.maKetQua=="003.1"||d.maKetQua=="130")
						{
							$('#luu').removeAttr("disabled");
							$('#luu').addClass('button_shadow');
							$('#luu').removeClass('button_disabled');
							$('#cbgioitinh').attr("disabled", true);
							$('#gioitinh').attr("disabled", "disabled");
							$('#noidangky').attr("disabled", "disabled");
							$('#noidangky_hienthi').attr("disabled", "disabled");
							$('#tungay').attr("disabled", "disabled");
							$('#denngay').attr("disabled", "disabled");
							 //$('#luu').addClass('button_disabled');
							 //$('#luu').removeClass('button_shadow');
						}
						if(d.maKetQua=="001"||d.maKetQua=="002")
						{
							$('#luu').removeAttr("disabled");
							$('#luu').addClass('button_shadow');
							$('#luu').removeClass('button_disabled');				
						}
						//Kiểm tra nếu có ký tự đồng bào
						if(d.maKetQua=="060")
						{
							if($lankiemtra==1)
							{
								if($('#hoten').val().indexOf('Ĕ') != -1||$('#hoten').val().indexOf('Č') != -1||$('#hoten').val().indexOf('Ŭ') != -1||$('#hoten').val().indexOf('Ŏ') != -1||$('#hoten').val().indexOf('Ơ̆') != -1||$('#hoten').val().indexOf('Ê̆') != -1||$('#hoten').val().indexOf('Ĭ') != -1||$('#hoten').val().indexOf('Ñ') != -1||$('#hoten').val().indexOf('Ô̆') != -1||$('#hoten').val().indexOf('Ŭ') != -1||$('#hoten').val().indexOf('Ư̆') != -1)
								{
									checkthe(removeEde($('#hoten').val()),$('#sobhyt').val());										
									return 0;
								}
							}									
						}
						//Kiểm tra trường hợp trẻ em chưa có thẻ
						if(d.maKetQua=="050" && $('#sobhyt').val().substring(0,2)== 'TE')
						{
							$("#part1").html('<b>Không tìm thấy thông tin thẻ BHYT, nếu bệnh nhân trẻ em đi khám bằng thẻ tạm vui lòng điền thông tin giấy tờ trẻ em để hệ thống mở khóa Lưu tiếp nhận</b>');
							editColorTrue("#tegt",0);
							editColorTrue("#tegiayto",0);
							$('#luu').attr("disabled", true);
							$('#luu').addClass('button_disabled');
							$('#luu').removeClass('button_shadow');
							$('#cbgioitinh').attr("disabled", true);
							$('#gioitinh').attr("disabled", "disabled");
							$('#noidangky').attr("disabled", "disabled");
							$('#noidangky_hienthi').attr("disabled", "disabled");
							$('#tungay').attr("disabled", "disabled");
							$('#denngay').attr("disabled", "disabled");
						}
						if(d.maKetQua=="050" && $('#sobhyt').val().substring(0,2)== 'TE'&& $('#tegiayto').val() =="GKS" ||$('#tegiayto').val() =="GCS"||$('#tegiayto').val() =="GTK")
						{
							$('#luu').removeAttr("disabled");
							$('#luu').addClass('button_shadow');
							$('#luu').removeClass('button_disabled');
							$('#cbgioitinh').attr("disabled", true);
							$('#gioitinh').attr("disabled", "disabled");
							$('#noidangky').attr("disabled", "disabled");
							$('#noidangky_hienthi').attr("disabled", "disabled");
							$('#tungay').attr("disabled", "disabled");
							$('#denngay').attr("disabled", "disabled");
							$("#part1").html('<b>Trẻ em đi khám bằng thẻ tạm, đã mở khóa Lưu tiếp nhận</b>');
							editColorTrue("#tegt",1);
							editColorTrue("#tegiayto",1);
							editColorTrue("#sobhyt",1);
						}
						//Check thông tuyến 66018						
						if(taikhoan.substring(0,5)=='66018'||taikhoan.substring(0,5)=='66106'||taikhoan.substring(0,5)=='66107'||taikhoan.substring(0,5)=='66108'||taikhoan.substring(0,5)=='66109'||taikhoan.substring(0,5)=='66110'||taikhoan.substring(0,5)=='66223'||taikhoan.substring(0,5)=='66217')
						{
							if(d.maDKBD!=null)
							{
								if(d.maDKBD == '66018'||d.maDKBD == '66106'||d.maDKBD== '66107'||d.maDKBD == '66108'||d.maDKBD == '66109'||d.maDKBD == '66110'||d.maDKBD == '66223'||d.maDKBD == '66217')
								{
									$('#thongtuyen_bhxh').prop('checked', false);
									$('#dungtuyen').prop('checked', true);
								}
								else
								{
									if(d.maDKBD.substring(0,2)=='66')
									{
										if(d.maDKBD == '66234'||d.maDKBD == '66001'||d.maDKBD == '66235'||d.maDKBD == '66232'||d.maDKBD == '66233'||d.maDKBD == '66236'||d.maDKBD == '66002'||d.maDKBD == '66069')
										{
											$('#thongtuyen_bhxh').prop('checked', false);
											$('#dungtuyen').prop('checked', false);										
										}
										else
										{
											$('#thongtuyen_bhxh').prop('checked', true);
											$('#dungtuyen').prop('checked', true);
										}
									}
									else
									{
										if(d.maDKBD =='97511')
										{
											$('#thongtuyen_bhxh').prop('checked', true);
											$('#dungtuyen').prop('checked', true);
										}
										else
										{
											$('#thongtuyen_bhxh').prop('checked', false);
											$('#dungtuyen').prop('checked', false);
										}
									}
								}									
							}
							else
							{
								if($("#noidangky").val !="")
								{
									if($('#noidangky').val() == '66018'||$('#noidangky').val() == '66106'||$('#noidangky').val() == '66107'||$('#noidangky').val() == '66108'||$('#noidangky').val() == '66109'||$('#noidangky').val() == '66110'||$('#noidangky').val() == '66223'||$('#noidangky').val() == '66217')
									{
										$('#thongtuyen_bhxh').prop('checked', false);
										$('#dungtuyen').prop('checked', true);
									}
									else
									{
										if($('#noidangky').val().substring(0,2)=='66')
										{
											if($('#noidangky').val() == '66234'||$('#noidangky').val() == '66001'||$('#noidangky').val() == '66235'||$('#noidangky').val() == '66232'||$('#noidangky').val() == '66233'||$('#noidangky').val() == '66236'||$('#noidangky').val() == '66002'||$('#noidangky').val() == '66069')
											{
												$('#thongtuyen_bhxh').prop('checked', false);
												$('#dungtuyen').prop('checked', false);										
											}
											else
											{
												$('#thongtuyen_bhxh').prop('checked', true);
												$('#dungtuyen').prop('checked', true);
											}
										}
										else
										{
											if($('#noidangky').val() =='97511')
											{
												$('#thongtuyen_bhxh').prop('checked', true);
												$('#dungtuyen').prop('checked', true);
											}
											else
											{
												$('#thongtuyen_bhxh').prop('checked', false);
												$('#dungtuyen').prop('checked', false);
											}
										}
									}										
								}
							}
						}
						//Check sđt
						
						if($('#sodt').val()  =="")
						{
							swal("Vui lòng nhập số điện thoại bệnh nhân \n Nếu bệnh nhân không có SĐT thì nhập số 0");
						}
						//Check của easoup
						if(taikhoan.substring(0,5)=='66074'||taikhoan.substring(0,5)=='66075'||taikhoan.substring(0,5)=='66076'||taikhoan.substring(0,5)=='66077'||taikhoan.substring(0,5)=='66078'||taikhoan.substring(0,5)=='66079'||taikhoan.substring(0,5)=='66080'||taikhoan.substring(0,5)=='66081'||taikhoan.substring(0,5)=='66214'||taikhoan.substring(0,5)=='66215')
						{
							if(d.maDKBD!=null)
							{
								if(d.maDKBD == '66074'||d.maDKBD == '66075'||d.maDKBD== '66076'||d.maDKBD == '66077'||d.maDKBD == '66078'||d.maDKBD == '66079'||d.maDKBD == '66080'||d.maDKBD == '66081'||d.maDKBD == '66214'||d.maDKBD == '66215')
								{
									//$('#thongtuyen_bhxh').prop('checked', false);
									//$('#dungtuyen').prop('checked', true);
								}
								else
								{
									if(d.maDKBD.substring(0,2)=='66')
									{
										swal('Thẻ đăng ký ngoài huyện, lưu ý khi tiếp nhận');										
									}
									else
									{
										swal('Thẻ đăng ký ngoài tỉnh, không thực hiện tiếp nhận');	
										$('#luu').attr("disabled", true);
										$('#luu').addClass('button_disabled');
										$('#luu').removeClass('button_shadow');
									}
								}									
							}
							else
							{
								if($("#noidangky").val !="")
								{
									if($('#noidangky').val() == '66074'||$('#noidangky').val() == '66075'||$('#noidangky').val() == '66076'||$('#noidangky').val() == '66077'||$('#noidangky').val() == '66078'||$('#noidangky').val() == '66079'||$('#noidangky').val() == '66080'||$('#noidangky').val() == '66081'||$('#noidangky').val() == '66214'||$('#noidangky').val() == '66215')
									{
										
									}
									else
									{
										if($('#noidangky').val().substring(0,2)=='66')
										{
											
											swal('Thẻ đăng ký ngoài huyện, lưu ý khi tiếp nhận');
										}
										else
										{
											swal('Thẻ đăng ký ngoài tỉnh, không thực hiện tiếp nhận');	
											$('#luu').attr("disabled", true);
											$('#luu').addClass('button_disabled');
											$('#luu').removeClass('button_shadow');
										}
									}										
								}
							}
						}
						
							//Mở khóa Lưu khi thông tin thẻ đúng
							//if(d.maKetQua=="003"||d.maKetQua=="000"||d.maKetQua=="001"||d.maKetQua=="002"||d.maKetQua=="003.1"||d.maKetQua=="004"||d.maKetQua=="130"){
								//	$('#luu').removeAttr("disabled");
								//	 $('#luu').addClass('button_shadow');
								//	 $('#luu').removeClass('button_disabled');
								//}
								//chinh mau
						$lankiemtra=0;
						}).fail( function (dfail)
						{
							$("#part1").html("<b>Không nhận được thông tin thẻ từ cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>");
							console.log("END_Không nhận được thông tin thẻ từ cổng BHXH");
							$('#mod_check_bhyt_hai').html("Không KT được");
							$('#mod_check_bhyt_hai').removeAttr("disabled");									
						});
						
					}
					else 
					{
						$("#part1").html("<b>Không đăng nhập được vào cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>");
						console.log("END_Không đăng nhập được vào cổng BHXH");
						 $('#mod_check_bhyt_hai').html("Không KT được");
						 $('#mod_check_bhyt_hai').removeAttr("disabled");
					}
			}).fail( function (dfail)
			{
				$("#part1").html("<b>Không kết nối được với cổng GDBHXH_Hiện tại không thể kiểm tra thẻ</b>");
				console.log("END_Lỗi không kết nối được cổng BHXH");
				$('#mod_check_bhyt_hai').html("Không KT được");
				$('#mod_check_bhyt_hai').removeAttr("disabled");
			});
				
		}
		$('#hoten').keypress(function (e){if (e.keyCode==13&&$('#hoten').val()!=""&&$('#sobhyt').val().length>=10) setTimeout(checkthe($('#hoten').val(),$('#sobhyt').val()),500);});
		$('#mayte').blur(resetBHYT);
		$('#nhapsttbatso').keypress(resetBHYT);
		$("#huy").on("click",resetBHYT);
		$("#xoa").on("click",resetBHYT);
		$("#luu").on("click",resetBHYT);
		$("#capnhat").on("click",resetBHYT);
		$("#themmoi").on("click",resetBHYT);
		$("#list_dsbenhnhan").dblclick(resetBHYT);
		$("#danhsachtiepnhan #list1").dblclick(resetBHYT);
		$("#mod_check_bhyt_hai").on("click",function (){if ($('#sobhyt').val().length>=10&&$('#hoten').val()!="") checkthe($('#hoten').val(),$('#sobhyt').val());});
		$('#sobhyt').keypress(function (e){if (e.keyCode==13&&$('#hoten').val()!=""&&$('#sobhyt').val().length>=10) setTimeout(checkthe($('#hoten').val(),$('#sobhyt').val()),500);});
		
	}
	//Kiểm tra ở bảng kê
	if ((document.URL.indexOf('kiemtrabangke') != -1) )
	{
		//$("#lammoi").after('<input tabindex="1" type="button" id="themnghiepvu" class="button_shadow" style="padding: 1px 1px;text-align:center; background-color: #4CAF50;color: green; width: 120px" value="Thêm nghiệp vụ">');
		$("#lammoi").parent().append('<span> </span><input type="button" name="kiemtrathebaohiem_bangke" id="kiemtrathebaohiem_bangke" value="KTthẻ BHYT" class="button_shadow" style="width:110px; background-color: #4CAF50;color: green;">');
		var isChiNamsinh = $('#chinamsinh').is(":checked");
		
		$('#kiemtrathebaohiem_bangke').on('click', function () 
		{
			swal('Đang check thẻ....');			
			if  ($("#hoten").val() =='')
			{swal('Bạn chưa chọn bệnh nhân');}
			else
			{
				var hoten = $("#hoten").val();
				var sobhyt = $('#sobhyt').val();
				var namsinh = $('#namsinh').val();
				var ngayBD = $('#gttungay').val();
				var ngayKT = $('#gtdenngay').val();
				var noidangky = $('#noidk').val();
				var gioitinh = $('#gioitinh').val() == 'true' ? 'Nam' : 'Nữ';
				$.get(window.location.origin+"/web_his/Cau_Hinh_Tham_So_XuatXMLBHYT",function(t){taikhoan=$(t).find("#motathamso123").val(),matkhau=md5($(t).find("#motathamso124").val())});
				$.post( "https://egw.baohiemxahoi.gov.vn/api/token/take", { username: taikhoan, password:matkhau}).done(function( dtake ) 
				{
					if(dtake.maKetQua==200)
					{
						$.post("https://egw.baohiemxahoi.gov.vn/api/egw/NhanLichSuKCB2018?token="+dtake.APIKey.access_token+"&id_token="+dtake.APIKey.id_token+"&username="+taikhoan+"&password="+matkhau,{maThe:sobhyt,hoTen:hoten,ngaySinh:namsinh}).done(function( d ) 
						{
							if(d.maKetQua=='000')
							{
								$noidangky="";
								if(noidangky != d.maDKBD)
								{
									$noidangky = '<b><span style="color:red">Mã đăng ký khám chữa bệnh sai, nơi đăng ký khám đúng: '+d.maDKBD +'<br></span></b>';
								}
								$gtinh='';
								if(gioitinh !=d.gioiTinh)
								{
									$gtinh='<b><span style="color:red">Giới tính bệnh nhân sai, giới tính đúng: '+d.gioiTinh +'<br></span></b>';							
								}									
								swal('<span style="color:green">Thẻ còn hạn sử dụng</span>',$gtinh+$noidangky+ '<span style="color:green">'+d.ghiChu+'</span>');
							}
							
							if(d.maKetQua=="003"&&d.maThe!=d.maTheMoi)
							{
								swal('<span style="color:green">Thẻ cũ hết giá trị sử dụng nhưng đã được cấp thẻ mới</span>','<b><span style="color:red">Mã thẻ mới : '+d.maTheMoi +'</span></b></br>'+d.ghiChu);
							}
							else
							{
								switch (d.maKetQua){
									
									case "001": swal("<span style='color:green'>Thẻ do BHXH Bộ Quốc Phòng quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân</span>","<span style='color:red'>"+d.ghiChu+"</span>"); break;
									case "002": swal("<span style='color:green'>Thẻ do BHXH Bộ Công An quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									//case "003":  swal("<span style='color:green'>Thẻ cũ hết giá trị sử dụng nhưng đã được cấp thẻ mới</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "003.1":  swal("<span style='color:green'>Thẻ đã được gia hạn</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "004":  swal("<span style='color:green'>Thẻ cũ còn giá trị sử dụng nhưng đã được cấp thẻ mới</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "010":  swal("<span style='color:green'>Thẻ hết giá trị sử dụng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "051":  swal("<span style='color:green'>Mã thẻ không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "052":  swal("<span style='color:green'>Mã tỉnh cấp thẻ(kí tự thứ 4,5 của mã thẻ) không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "053":  swal("<span style='color:green'>Mã quyền lợi thẻ(kí tự thứ 3 của mã thẻ) không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "050":  swal("<span style='color:green'>Không thấy thông tin thẻ bhyt</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "060":  swal("<span style='color:green'>Thẻ sai họ tên</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "061":  swal("<span style='color:green'>Thẻ sai họ tên(đúng kí tự đầu)</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "070":  swal("<span style='color:green'>Thẻ sai ngày sinh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "100":  swal("<span style='color:green'>Lỗi khi lấy dữ liệu sổ thẻ</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "101":  swal("<span style='color:green'>Lỗi server</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "110":  swal("<span style='color:green'>Thẻ đã thu hồi</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "120":  swal("<span style='color:green'>Thẻ đã báo giảm</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "121":  swal("<span style='color:green'>Thẻ đã báo giảm. Giảm chuyển ngoại tỉnh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "122":  swal("<span style='color:green'>Thẻ đã báo giảm. Giảm chuyển nội tỉnh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "123":  swal("<span style='color:green'>Thẻ đã báo giảm. Thu hồi do tăng lại cùng đơn vị</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "124":  swal("<span style='color:green'>Thẻ đã báo giảm. Ngừng tham gia</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "130":  swal("<span style='color:green'>Trẻ em không xuất trình thẻ</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "205":  swal("<span style='color:green'>Lỗi sai định dạng tham số truyền vào</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "401":  swal("<span style='color:green'>Lỗi xác thực tài khoản</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									//default:  swal("Không xác định");break;
								  }
							}
						});
					}
				}).fail( function (dfail)
					{
						swal('<b>Không nhận được thông tin thẻ từ cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>');
						//("#part1").html("<b>Không nhận được thông tin thẻ từ cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>");
						console.log("END_Không nhận được thông tin thẻ từ cổng BHXH");
						//$('#mod_check_bhyt_hai').html("Không KT được");
						//$('#mod_check_bhyt_hai').removeAttr("disabled");
						
					});
			}
			
		}
		);
		//Kiểm tra thẻ trong kiểm tra thông tin hành chính
		$('#doituong_hc').width(500);
		$('#sobhyt_hc').width(500);
		$('#sobhyt_hc').after('<input type="button" class="button_disabled" disabled="disabled" name="kiemtrabhyt_hc" id="kiemtrabhyt_hc" value="KTthẻ BHYT">');
		$('#sua_hc').on('click', function () 
		{
			$('#kiemtrabhyt_hc').removeAttr("disabled");
			$('#kiemtrabhyt_hc').addClass('button_shadow');
			$('#kiemtrabhyt_hc').removeClass('button_disabled');
			$('#kiemtrabhyt_hc').css({'width':'110px', 'background-color': '#4CAF50','color': 'green'});
		});
		$('#luu_hc').on('click', function () 
		{
			$('#kiemtrabhyt_hc').attr("disabled",true);
			$('#kiemtrabhyt_hc').addClass('button_disabled');
			$('#kiemtrabhyt_hc').removeClass('button_shadow');
			$('#kiemtrabhyt_hc').css({'width':'110px', 'background-color': '','color': ''});
		});
		function kiemtrathe(hoten,lankiemtra,sobhyt)
		{
			$lankiemtra = lankiemtra + 1;
			var sobhyt = sobhyt;
			if  (sobhyt =='')
			{swal('Bệnh nhân không có thẻ BHYT');}
			else
			{
				var isChiNamsinh = $('#chinamsinh').is(":checked");
				var hoten = hoten;
				//var sobhyt = $('#suatt_sobhyt').val();
				var namsinh = $('#namsinh_hc').val();
				var ngayBD = $('#tungay_hc').val();
				var ngayKT = $('#denngay_hc').val();
				var noidangky = $('#noidangky_hc').val();
				var gioitinh = $('#cbgioitinh_hc').val() == 'true' ? 'Nam' : 'Nữ';
				//swal(hoten+sobhyt+namsinh+ngayBD+ngayKT+noidangky+gioitinh);
				$.get(window.location.origin+"/web_his/Cau_Hinh_Tham_So_XuatXMLBHYT",function(t){taikhoan=$(t).find("#motathamso123").val(),matkhau=md5($(t).find("#motathamso124").val())});
				$.post( "https://egw.baohiemxahoi.gov.vn/api/token/take", { username: taikhoan, password:matkhau}).done(function( dtake ) 
				{
					if(dtake.maKetQua==200)
					{
						$.post("https://egw.baohiemxahoi.gov.vn/api/egw/NhanLichSuKCB2018?token="+dtake.APIKey.access_token+"&id_token="+dtake.APIKey.id_token+"&username="+taikhoan+"&password="+matkhau,{maThe:sobhyt,hoTen:hoten,ngaySinh:namsinh}).done(function( d ) 
						{					
							if(d.maKetQua=='000')
							{
								if($('#sobhyt_hc').length <= 10)
								{
									$('#sobhyt_hc').val(d.maThe);
								}								
								$('#noidangky_hc').val(d.maDKBD);
								if("Nam"==d.gioiTinh){$("#cbgioitinh_hc").val("true");$("#gioitinh_hc").val("1");}
								else {$("#cbgioitinh_hc").val("false");$("#gioitinh_hc").val("0");}
								switch (d.ngaySinh.length)
								{
									case 4: 
										$("#chinamsinh").prop("checked", true);$("#namsinh_hc").val("01/01/"+d.ngaySinh);tempngaysinh="01/01/"+d.ngaySinh;break;
									case 7: 
										$("#chinamsinh").prop("checked", true);$("#namsinh_hc").val("01/"+d.ngaySinh);tempngaysinh="01/"+d.ngaySinh;break;
									case 10:
										$("#chinamsinh").prop("checked", false);$("#namsinh_hc").val(d.ngaySinh);tempngaysinh=d.ngaySinh;break;
										//default : editColorTrue("#namsinh_hc",1);
								}
								$('#manoidoituong').val(d.maKV);
								$("#diachi_hc").val(d.diaChi);
								$('#thoigian_du5namlientuc_tnhc').val(d.ngayDu5Nam);
								$("#noidangky_hienthi").val(dmndk[d.maDKBD]);
								//Lấy từ ngày đến ngày
								$('#tungay_hc').val(d.gtTheTu);
								$('#denngay_hc').val(d.gtTheDen);
								$("#tmptungay").val(d.gtTheTu);
								$("#tmpdenngay").val(d.gtTheDen);
								//Do khi hover sẽ bị đổi nên gán thêm hàm hover
								$('#thoigian_du5namlientuc_tnhc').hover(function()
								{
									$('#thoigian_du5namlientuc_tnhc').val(d.ngayDu5Nam);
								},function()
								{
									$('#thoigian_du5namlientuc_tnhc').val(d.ngayDu5Nam);
								});
								$('#tungay_hc').hover(function(){
									$('#tungay_hc').val(d.gtTheTu);
								},function(){
									$('#tungay_hc').val(d.gtTheTu);
								});
								$('#denngay_hc').hover(function(){
									$('#denngay_hc').val(d.gtTheDen);
								},function(){
									$('#denngay_hc').val(d.gtTheDen);
								});
									//kết thúc hover
									//Check đúng tuyến
								if(taikhoan.substring(0,5)=='66018'||taikhoan.substring(0,5)=='66106'||taikhoan.substring(0,5)=='66107'||taikhoan.substring(0,5)=='66108'||taikhoan.substring(0,5)=='66109'||taikhoan.substring(0,5)=='66110'||taikhoan.substring(0,5)=='66223'||taikhoan.substring(0,5)=='66217')
								{
									if(d.maDKBD!=null)
									{
										if(d.maDKBD == '66018'||d.maDKBD == '66106'||d.maDKBD== '66107'||d.maDKBD == '66108'||d.maDKBD == '66109'||d.maDKBD == '66110'||d.maDKBD == '66223'||d.maDKBD == '66217')
										{
											$('#thongtuyen_bhxh').prop('checked', false);
											$('#dungtuyen_hc').prop('checked', true);
										}
										else
										{
											if(d.maDKBD.substring(0,2)=='66')
											{
												if(d.maDKBD == '66234'||d.maDKBD == '66001'||d.maDKBD == '66235'||d.maDKBD == '66232'||d.maDKBD == '66233'||d.maDKBD == '66236'||d.maDKBD == '66002'||d.maDKBD == '66069')
												{
													$('#thongtuyen_bhxh').prop('checked', false);
													$('#dungtuyen_hc').prop('checked', false);										
												}
												else
												{
													$('#thongtuyen_bhxh').prop('checked', true);
													$('#dungtuyen_hc').prop('checked', true);
												}
											}
											else
											{
												if(d.maDKBD =='97511')
												{
													$('#thongtuyen_bhxh').prop('checked', true);
													$('#dungtuyen_hc').prop('checked', true);
												}
												else
												{
													$('#thongtuyen_bhxh').prop('checked', false);
													$('#dungtuyen_hc').prop('checked', false);
												}
											}
										}									
									}
									else
									{
										if($("#noidangky").val !="")
										{
											if($('#noidangky').val() == '66018'||$('#noidangky').val() == '66106'||$('#noidangky').val() == '66107'||$('#noidangky').val() == '66108'||$('#noidangky').val() == '66109'||$('#noidangky').val() == '66110'||$('#noidangky').val() == '66223'||$('#noidangky').val() == '66217')
											{
												$('#thongtuyen_bhxh').prop('checked', false);
												$('#dungtuyen_hc').prop('checked', true);
											}
											else
											{
												if($('#noidangky').val().substring(0,2)=='66')
												{
													if($('#noidangky').val() == '66234'||$('#noidangky').val() == '66001'||$('#noidangky').val() == '66235'||$('#noidangky').val() == '66232'||$('#noidangky').val() == '66233'||$('#noidangky').val() == '66236'||$('#noidangky').val() == '66002'||$('#noidangky').val() == '66069')
													{
														$('#thongtuyen_bhxh').prop('checked', false);
														$('#dungtuyen_hc').prop('checked', false);										
													}
													else
													{
														$('#thongtuyen_bhxh').prop('checked', true);
														$('#dungtuyen_hc').prop('checked', true);
													}
												}
												else
												{
													if($('#noidangky').val() =='97511')
													{
														$('#thongtuyen_bhxh').prop('checked', true);
														$('#dungtuyen_hc').prop('checked', true);
													}
													else
													{
														$('#thongtuyen_bhxh').prop('checked', false);
														$('#dungtuyen_hc').prop('checked', false);
													}
												}
											}										
										}
									}
								}
								//Kết thúc thông tuyến
								//Kiểm tra tỷ lệ hưởng
								var madt = d.maThe.substring(0, 3);
								var url = "https://yte-daklak.vnpthis.vn/web_his/kiemtrathebhyt?madt=" + madt.toUpperCase();
									$.ajax({
											url: url,
												//async: false
											}).done(function (data){
											var arr = data.toString().split(":");
											$("#chuoind_hc").val(madt.toUpperCase());
											$("#doituong_hc").val(arr[0]);
											$("#tlmg_hc").val(arr[1]);
											});
								//Hiển thị thông báo
								
								swal('<span style="color:green">Thẻ còn hạn sử dụng</span>','<span style="color:green">'+d.ghiChu+'</span>');
							}
							if(d.maKetQua=="060")
							{								
								if($lankiemtra==1)
								{									
									if(hoten.indexOf('Ĕ') != -1||hoten.indexOf('Č') != -1||hoten.indexOf('Ŭ') != -1||hoten.indexOf('Ŏ') != -1||hoten.indexOf('Ơ̆') != -1||hoten.indexOf('Ê̆') != -1||hoten.indexOf('Ĭ') != -1||hoten.indexOf('Ñ') != -1||hoten.indexOf('Ô̆') != -1||hoten.indexOf('Ŭ') != -1||hoten.indexOf('Ư̆') != -1)
									{										
										kiemtrathe(removeEde($('#hoten_hc').val()),1, sobhyt);											
										return 0;
									}
								}									
							}									  
							if(d.maKetQua=="003"&&d.maThe!=d.maTheMoi)
							{
								swal('<span style="color:green">Thẻ cũ hết giá trị sử dụng nhưng đã được cấp thẻ mới</span>','<b><span style="color:red">Mã thẻ mới : '+d.maTheMoi +'</span></b></br>'+d.ghiChu);
								$("#sobhyt_hc").val(d.maTheMoi);
								$('#sobhyt_hc').hover(function(){
									$('#sobhyt_hc').val(d.maTheMoi);
								},function(){
									$('#sobhyt_hc').val(d.maTheMoi);
								});
							}								
							else
							{
								switch (d.maKetQua)
								{									
									case "001": swal("<span style='color:green'>Thẻ do BHXH Bộ Quốc Phòng quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân</span>","<span style='color:red'>"+d.ghiChu+"</span>"); break;
									case "002": swal("<span style='color:green'>Thẻ do BHXH Bộ Công An quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "003":  swal("<span style='color:green'>Thẻ cũ hết giá trị sử dụng nhưng đã được cấp thẻ mới</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "003.1":  swal("<span style='color:green'>Thẻ đã được gia hạn</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "004":  swal("<span style='color:green'>Thẻ cũ còn giá trị sử dụng nhưng đã được cấp thẻ mới</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "010":  swal("<span style='color:green'>Thẻ hết giá trị sử dụng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "051":  swal("<span style='color:green'>Mã thẻ không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "052":  swal("<span style='color:green'>Mã tỉnh cấp thẻ(kí tự thứ 4,5 của mã thẻ) không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "053":  swal("<span style='color:green'>Mã quyền lợi thẻ(kí tự thứ 3 của mã thẻ) không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "050":  swal("<span style='color:green'>Không thấy thông tin thẻ bhyt</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "060":  swal("<span style='color:green'>Thẻ sai họ tên</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "061":  swal("<span style='color:green'>Thẻ sai họ tên(đúng kí tự đầu)</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "070":  swal("<span style='color:green'>Thẻ sai ngày sinh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "100":  swal("<span style='color:green'>Lỗi khi lấy dữ liệu sổ thẻ</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "101":  swal("<span style='color:green'>Lỗi server</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "110":  swal("<span style='color:green'>Thẻ đã thu hồi</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "120":  swal("<span style='color:green'>Thẻ đã báo giảm</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "121":  swal("<span style='color:green'>Thẻ đã báo giảm. Giảm chuyển ngoại tỉnh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "122":  swal("<span style='color:green'>Thẻ đã báo giảm. Giảm chuyển nội tỉnh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "123":  swal("<span style='color:green'>Thẻ đã báo giảm. Thu hồi do tăng lại cùng đơn vị</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "124":  swal("<span style='color:green'>Thẻ đã báo giảm. Ngừng tham gia</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "130":  swal("<span style='color:green'>Trẻ em không xuất trình thẻ</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "205":  swal("<span style='color:green'>Lỗi sai định dạng tham số truyền vào</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "401":  swal("<span style='color:green'>Lỗi xác thực tài khoản</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									//default:  swal("Không xác định");break;
								}
							}
						});
					}
				}).fail( function (dfail)
					{
						swal('<b>Không nhận được thông tin thẻ từ cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>');
						//("#part1").html("<b>Không nhận được thông tin thẻ từ cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>");
						console.log("END_Không nhận được thông tin thẻ từ cổng BHXH");
						//$('#mod_check_bhyt_hai').html("Không KT được");
						//$('#mod_check_bhyt_hai').removeAttr("disabled");
						
					});
			}
			$('#hoten_hc').focus();
			$('#ui-datepicker-div').css("display","none");
			lankiemtra=0;
		}
		$('#kiemtrabhyt_hc').on('click', function () 
		{
			swal('Đang check thẻ....');
			$lankiemtra=0;
			kiemtrathe($('#hoten_hc').val(),$lankiemtra,$('#sobhyt_hc').val());
		});
		$('#sobhyt_hc').keypress(function (e)
		{
			if (e.keyCode==13&&$('#sobhyt_hc').val().length>=10)
			{
				swal('Đang check thẻ....');
				$lankiemtra=0;
				kiemtrathe($('#hoten_hc').val(),$lankiemtra,$('#sobhyt_hc').val());
			}
		});
		//cmt_hc
		$('#cmt_hc').keypress(function (e)
		{
			if (e.keyCode==13&&$('#cmt_hc').val().length>=12)
			{
				swal('Đang check thẻ....');
				$lankiemtra=0;
				kiemtrathe($('#hoten_hc').val(),$lankiemtra,$('#cmt_hc').val());
			}
		});
	}
	if ((document.URL.indexOf('khambenhnoitru') != -1)||(document.URL.indexOf('khambenhBANT') != -1) ||(document.URL.indexOf('kiemtrabangkebannt') != -1)||(document.URL.indexOf('kiemtrabangkenoitru') != -1))
	{	
		$('#btktthongtinthebhyt').css("display", "none");
		//$("#lammoi").after('<input tabindex="1" type="button" id="themnghiepvu" class="button_shadow" style="padding: 1px 1px;text-align:center; background-color: #4CAF50;color: green; width: 120px" value="Thêm nghiệp vụ">');
		$("#btktthongtinthebhyt").after('<input type="button" name="kiemtrathebaohiem_dlk" id="kiemtrathebaohiem_dlk" value="KTthẻ BHYT" class="button_disabled">');
		function kiemtrathe(hoten,lankiemtra,sobhyt)
		{
			$lankiemtra = lankiemtra + 1;
			var sobhyt = sobhyt;
			if  (sobhyt =='')
			{swal('Bệnh nhân không có thẻ BHYT');}
			else
			{
				var isChiNamsinh = $('#chinamsinh').is(":checked");
				var hoten = hoten;
				//var sobhyt = $('#suatt_sobhyt').val();
				var namsinh = $('#suatt_namsinh').val();
				var ngayBD = $('#suatt_tungay').val();
				var ngayKT = $('#suatt_denngay').val();
				var noidangky = $('#suatt_madangky').val();
				var gioitinh = $('#cbgioitinh').val() == 'true' ? 'Nam' : 'Nữ';
				//swal(hoten+sobhyt+namsinh+ngayBD+ngayKT+noidangky+gioitinh);
				$.get(window.location.origin+"/web_his/Cau_Hinh_Tham_So_XuatXMLBHYT",function(t){taikhoan=$(t).find("#motathamso123").val(),matkhau=md5($(t).find("#motathamso124").val())});
				$.post( "https://egw.baohiemxahoi.gov.vn/api/token/take", { username: taikhoan, password:matkhau}).done(function( dtake ) 
				{
					if(dtake.maKetQua==200)
					{
						$.post("https://egw.baohiemxahoi.gov.vn/api/egw/NhanLichSuKCB2018?token="+dtake.APIKey.access_token+"&id_token="+dtake.APIKey.id_token+"&username="+taikhoan+"&password="+matkhau,{maThe:sobhyt,hoTen:hoten,ngaySinh:namsinh}).done(function( d ) 
						{					
							if(d.maKetQua=='000')
							{
								if($('#suatt_sobhyt').length<=10)
								{
									$('#suatt_sobhyt').val(d.maThe);
								}								
								$('#suatt_madangky').val(d.maDKBD);
								if("Nam"==d.gioiTinh){$("#cbgioitinh").val("true");$("#gioitinh_hc").val("1");}
								else {$("#cbgioitinh").val("false");$("#gioitinh_hc").val("0");}
								switch (d.ngaySinh.length)
								{
									case 4: 
										$("#chinamsinh").prop("checked", true);$("#suatt_namsinh").val("01/01/"+d.ngaySinh);tempngaysinh="01/01/"+d.ngaySinh;break;
									case 7: 
										$("#chinamsinh").prop("checked", true);$("#suatt_namsinh").val("01/"+d.ngaySinh);tempngaysinh="01/"+d.ngaySinh;break;
									case 10:
										$("#chinamsinh").prop("checked", false);$("#suatt_namsinh").val(d.ngaySinh);tempngaysinh=d.ngaySinh;break;
										//default : editColorTrue("#suatt_namsinh",1);
								}
								$('#manoidoituong').val(d.maKV);
								$("#suatt_diachi").val(d.diaChi);
								$('#thoigian_du5namlientuc_tnhc').val(d.ngayDu5Nam);
								$("#suatt_tendangky").val(dmndk[d.maDKBD]);
								//Lấy từ ngày đến ngày
								$('#suatt_tungay').val(d.gtTheTu);
								$('#suatt_denngay').val(d.gtTheDen);
								$("#tmptungay").val(d.gtTheTu);
								$("#tmpdenngay").val(d.gtTheDen);
								//Do khi hover sẽ bị đổi nên gán thêm hàm hover
								$('#thoigian_du5namlientuc_tnhc').hover(function()
								{
									$('#thoigian_du5namlientuc_tnhc').val(d.ngayDu5Nam);
								},function()
								{
									$('#thoigian_du5namlientuc_tnhc').val(d.ngayDu5Nam);
								});
								$('#suatt_tungay').hover(function(){
									$('#suatt_tungay').val(d.gtTheTu);
								},function(){
									$('#suatt_tungay').val(d.gtTheTu);
								});
								$('#suatt_denngay').hover(function(){
									$('#suatt_denngay').val(d.gtTheDen);
								},function(){
									$('#suatt_denngay').val(d.gtTheDen);
								});
									//kết thúc hover
									//Check đúng tuyến
								if(taikhoan.substring(0,5)=='66018'||taikhoan.substring(0,5)=='66106'||taikhoan.substring(0,5)=='66107'||taikhoan.substring(0,5)=='66108'||taikhoan.substring(0,5)=='66109'||taikhoan.substring(0,5)=='66110'||taikhoan.substring(0,5)=='66223'||taikhoan.substring(0,5)=='66217')
								{
									if(d.maDKBD!=null)
									{
										if(d.maDKBD == '66018'||d.maDKBD == '66106'||d.maDKBD== '66107'||d.maDKBD == '66108'||d.maDKBD == '66109'||d.maDKBD == '66110'||d.maDKBD == '66223'||d.maDKBD == '66217')
										{
											$('#thongtuyen_bhxh').prop('checked', false);
											$('#suatt_cbx_dungtuyen').prop('checked', true);
										}
										else
										{
											if(d.maDKBD.substring(0,2)=='66')
											{
												if(d.maDKBD == '66234'||d.maDKBD == '66001'||d.maDKBD == '66235'||d.maDKBD == '66232'||d.maDKBD == '66233'||d.maDKBD == '66236'||d.maDKBD == '66002'||d.maDKBD == '66069')
												{
													$('#thongtuyen_bhxh').prop('checked', false);
													$('#suatt_cbx_dungtuyen').prop('checked', false);										
												}
												else
												{
													$('#thongtuyen_bhxh').prop('checked', true);
													$('#suatt_cbx_dungtuyen').prop('checked', true);
												}
											}
											else
											{
												if(d.maDKBD =='97511')
												{
													$('#thongtuyen_bhxh').prop('checked', true);
													$('#suatt_cbx_dungtuyen').prop('checked', true);
												}
												else
												{
													$('#thongtuyen_bhxh').prop('checked', false);
													$('#suatt_cbx_dungtuyen').prop('checked', false);
												}
											}
										}									
									}
									else
									{
										if($("#noidangky").val !="")
										{
											if($('#noidangky').val() == '66018'||$('#noidangky').val() == '66106'||$('#noidangky').val() == '66107'||$('#noidangky').val() == '66108'||$('#noidangky').val() == '66109'||$('#noidangky').val() == '66110'||$('#noidangky').val() == '66223'||$('#noidangky').val() == '66217')
											{
												$('#thongtuyen_bhxh').prop('checked', false);
												$('#suatt_cbx_dungtuyen').prop('checked', true);
											}
											else
											{
												if($('#noidangky').val().substring(0,2)=='66')
												{
													if($('#noidangky').val() == '66234'||$('#noidangky').val() == '66001'||$('#noidangky').val() == '66235'||$('#noidangky').val() == '66232'||$('#noidangky').val() == '66233'||$('#noidangky').val() == '66236'||$('#noidangky').val() == '66002'||$('#noidangky').val() == '66069')
													{
														$('#thongtuyen_bhxh').prop('checked', false);
														$('#suatt_cbx_dungtuyen').prop('checked', false);										
													}
													else
													{
														$('#thongtuyen_bhxh').prop('checked', true);
														$('#suatt_cbx_dungtuyen').prop('checked', true);
													}
												}
												else
												{
													if($('#noidangky').val() =='97511')
													{
														$('#thongtuyen_bhxh').prop('checked', true);
														$('#suatt_cbx_dungtuyen').prop('checked', true);
													}
													else
													{
														$('#thongtuyen_bhxh').prop('checked', false);
														$('#suatt_cbx_dungtuyen').prop('checked', false);
													}
												}
											}										
										}
									}
								}
								else
								{
									$('#suatt_cbx_dungtuyen').prop('checked', true);
								}
								//Kết thúc thông tuyến
								//Kiểm tra tỷ lệ hưởng
								var madt = d.maThe.substring(0, 3);
								var url = "https://yte-daklak.vnpthis.vn/web_his/kiemtrathebhyt?madt=" + madt.toUpperCase();
									$.ajax({
											url: url,
												//async: false
											}).done(function (data){
											var arr = data.toString().split(":");
											$("#suatt_chuoinhandang").val(madt.toUpperCase());
											$("#suatt_doituongthe").val(arr[0]);
											$("#suatt_tilemiengiam").val(arr[1]);
											});
								swal('<span style="color:green">Thẻ còn hạn sử dụng</span>','<span style="color:green">'+d.ghiChu+'</span>');
								//$("#suatt_sobhyt").val()!=d.maThe?editColorTrue("#suatt_sobhyt",0):editColorTrue("#suatt_sobhyt",1);
								//$("#suatt_madangky").val()!=d.maDKBD?editColorTrue("#suatt_madangky",0):editColorTrue("#suatt_madangky",1);
								//$("#suatt_diachi").val()!=d.diaChi?editColorTrue("#suatt_diachi",0):editColorTrue("#suatt_diachi",1);
								//$("#sobhyt_hc").val()!=d.maThe?editColorTrue("#sobhyt_hc",0):editColorTrue("#sobhyt_hc",1);
								//$("#sobhyt_hc").val()!=d.maThe?editColorTrue("#sobhyt_hc",0):editColorTrue("#sobhyt_hc",1);
							}
							if(d.maKetQua=="060")
							{								
								if($lankiemtra==1)
								{									
									if(hoten.indexOf('Ĕ') != -1||hoten.indexOf('Č') != -1||hoten.indexOf('Ŭ') != -1||hoten.indexOf('Ŏ') != -1||hoten.indexOf('Ơ̆') != -1||hoten.indexOf('Ê̆') != -1||hoten.indexOf('Ĭ') != -1||hoten.indexOf('Ñ') != -1||hoten.indexOf('Ô̆') != -1||hoten.indexOf('Ŭ') != -1||hoten.indexOf('Ư̆') != -1)
									{										
										kiemtrathe(removeEde($('#suatt_hoten').val()),1, sobhyt);											
										return 0;
									}
								}									
							}									  
							if(d.maKetQua=="003"&&d.maThe!=d.maTheMoi)
							{
								swal('<span style="color:green">Thẻ cũ hết giá trị sử dụng nhưng đã được cấp thẻ mới</span>',d.ghiChu +'<b><span style="color:red">Mã thẻ mới : '+d.maTheMoi +'</span></b>');
								$("#sobhyt").val(d.maTheMoi);
								$('#sobhyt').hover(function(){
									$('#sobhyt').val(d.maTheMoi);
								},function(){
									$('#sobhyt').val(d.maTheMoi);
								});
							}
								
							else
							{
								switch (d.maKetQua)
								{									
									case "001": swal("<span style='color:green'>Thẻ do BHXH Bộ Quốc Phòng quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân</span>","<span style='color:red'>"+d.ghiChu+"</span>"); break;
									case "002": swal("<span style='color:green'>Thẻ do BHXH Bộ Công An quản lý, đề nghị kiểm tra thẻ và thông tin giấy tờ tùy thân</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "003":  swal("<span style='color:green'>Thẻ cũ hết giá trị sử dụng nhưng đã được cấp thẻ mới</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "003.1":  swal("<span style='color:green'>Thẻ đã được gia hạn</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "004":  swal("<span style='color:green'>Thẻ cũ còn giá trị sử dụng nhưng đã được cấp thẻ mới</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "010":  swal("<span style='color:green'>Thẻ hết giá trị sử dụng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "051":  swal("<span style='color:green'>Mã thẻ không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "052":  swal("<span style='color:green'>Mã tỉnh cấp thẻ(kí tự thứ 4,5 của mã thẻ) không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "053":  swal("<span style='color:green'>Mã quyền lợi thẻ(kí tự thứ 3 của mã thẻ) không đúng</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "050":  swal("<span style='color:green'>Không thấy thông tin thẻ bhyt</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "060":  swal("<span style='color:green'>Thẻ sai họ tên</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "061":  swal("<span style='color:green'>Thẻ sai họ tên(đúng kí tự đầu)</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "070":  swal("<span style='color:green'>Thẻ sai ngày sinh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "100":  swal("<span style='color:green'>Lỗi khi lấy dữ liệu sổ thẻ</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "101":  swal("<span style='color:green'>Lỗi server</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "110":  swal("<span style='color:green'>Thẻ đã thu hồi</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "120":  swal("<span style='color:green'>Thẻ đã báo giảm</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "121":  swal("<span style='color:green'>Thẻ đã báo giảm. Giảm chuyển ngoại tỉnh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "122":  swal("<span style='color:green'>Thẻ đã báo giảm. Giảm chuyển nội tỉnh</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "123":  swal("<span style='color:green'>Thẻ đã báo giảm. Thu hồi do tăng lại cùng đơn vị</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "124":  swal("<span style='color:green'>Thẻ đã báo giảm. Ngừng tham gia</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "130":  swal("<span style='color:green'>Trẻ em không xuất trình thẻ</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "205":  swal("<span style='color:green'>Lỗi sai định dạng tham số truyền vào</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									case "401":  swal("<span style='color:green'>Lỗi xác thực tài khoản</span>","<span style='color:red'>"+d.ghiChu+"</span>");break;
									//default:  swal("Không xác định");break;
								}
							}
						});
					}
				}).fail( function (dfail)
					{
						swal('<b>Không nhận được thông tin thẻ từ cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>');
						//("#part1").html("<b>Không nhận được thông tin thẻ từ cổng BHXH_Hiện tại không thể kiểm tra thẻ</b>");
						console.log("END_Không nhận được thông tin thẻ từ cổng BHXH");
						//$('#mod_check_bhyt_hai').html("Không KT được");
						//$('#mod_check_bhyt_hai').removeAttr("disabled");
						
					});
			}
			$('#suatt_hoten').focus();
			$('#ui-datepicker-div').css("display","none");
			lankiemtra=0;
		}
		
		//Click nút Kiểm tra thẻ BHYT
		$('#kiemtrathebaohiem_dlk').on('click', function () 
		{
			swal('Đang check thẻ....');
			$lankiemtra=0;
			kiemtrathe($('#suatt_hoten').val(),$lankiemtra,$('#suatt_sobhyt').val());
		}
		);
		//Nhập thẻ và nhấn Enter
		$('#suatt_sobhyt').keypress(function (e)
		{
			if (e.keyCode==13&&$('#suatt_sobhyt').val().length>=10)
			{
				swal('Đang check thẻ....');
				$lankiemtra=0;
				kiemtrathe($('#suatt_hoten').val(),$lankiemtra,$('#suatt_sobhyt').val());
			}
		});
		//suatt_cmt
		$('#suatt_cmt').keypress(function (e)
		{
			if (e.keyCode==13&&$('#suatt_cmt').val().length>=12)
			{
				swal('Đang check thẻ....');
				$lankiemtra=0;
				kiemtrathe($('#suatt_hoten').val(),$lankiemtra,$('#suatt_cmt').val());
			}
		});
		$('#suatt_bt_sua').on('click', function () 
		{
			$('#kiemtrathebaohiem_dlk').removeAttr("disabled");
			$('#kiemtrathebaohiem_dlk').removeClass('button_disabled');
			$('#kiemtrathebaohiem_dlk').addClass('button_shadow');			
			$('#kiemtrathebaohiem_dlk').css({'width':'110px', 'background-color': '#4CAF50','color': 'green'});
		});
		$('#suatt_bt_luu').on('click', function () 
		{
			$('#kiemtrathebaohiem_dlk').attr("disabled",true);
			$('#kiemtrathebaohiem_dlk').addClass('button_disabled');
			$('#kiemtrathebaohiem_dlk').removeClass('button_shadow');
			$('#kiemtrathebaohiem_dlk').css({'width':'110px', 'background-color': '','color': ''});
		});
		$('#suatt_madangky').keypress(function (e){if (e.keyCode==13&&$('#suatt_madangky').val()!="")
		{
			if(taikhoan.substring(0,5)=='66018'||taikhoan.substring(0,5)=='66106'||taikhoan.substring(0,5)=='66107'||taikhoan.substring(0,5)=='66108'||taikhoan.substring(0,5)=='66109'||taikhoan.substring(0,5)=='66110'||taikhoan.substring(0,5)=='66223'||taikhoan.substring(0,5)=='66217')
			{
				if($('#suatt_madangky').val() == '66018'||$('#suatt_madangky').val() == '66106'||$('#suatt_madangky').val() == '66107'||$('#suatt_madangky').val() == '66108'||$('#suatt_madangky').val() == '66109'||$('#suatt_madangky').val() == '66110'||$('#suatt_madangky').val() == '66223'||$('#suatt_madangky').val() == '66217')
				{
					$('#thongtuyen_bhxh').prop('checked', false);
					$('#suatt_cbx_dungtuyen').prop('checked', true);
				}
				else
				{
					if($('#suatt_madangky').val().substring(0,2)=='66')
					{
						if($('#suatt_madangky').val() == '66234'||$('#suatt_madangky').val() == '66001'||$('#suatt_madangky').val() == '66235'||$('#suatt_madangky').val() == '66232'||$('#suatt_madangky').val() == '66233'||$('#suatt_madangky').val() == '66236'||$('#suatt_madangky').val() == '66002'||$('#suatt_madangky').val() == '66069')
							{
								$('#thongtuyen_bhxh').prop('checked', false);
								$('#suatt_cbx_dungtuyen').prop('checked', false);										
							}
							else
							{
								$('#thongtuyen_bhxh').prop('checked', true);
								$('#suatt_cbx_dungtuyen').prop('checked', true);
							}
					}
					else
					{
						if($('#suatt_madangky').val() =='97511')
						{
							$('#thongtuyen_bhxh').prop('checked', true);
							$('#suatt_cbx_dungtuyen').prop('checked', true);
						}
						else
						{
							$('#thongtuyen_bhxh').prop('checked', false);
							$('#suatt_cbx_dungtuyen').prop('checked', false);
						}
					}
				}
			}
			kiemtratylehuong($('#suatt_sobhyt').val());
		}
		});

		$('#suatt_madangky').keyup(function ()
		{
			if(taikhoan.substring(0,5)=='66018'||taikhoan.substring(0,5)=='66106'||taikhoan.substring(0,5)=='66107'||taikhoan.substring(0,5)=='66108'||taikhoan.substring(0,5)=='66109'||taikhoan.substring(0,5)=='66110'||taikhoan.substring(0,5)=='66223'||taikhoan.substring(0,5)=='66217')
			{
				if($('#suatt_madangky').val() == '66018'||$('#suatt_madangky').val() == '66106'||$('#suatt_madangky').val() == '66107'||$('#suatt_madangky').val() == '66108'||$('#suatt_madangky').val() == '66109'||$('#suatt_madangky').val() == '66110'||$('#suatt_madangky').val() == '66223'||$('#suatt_madangky').val() == '66217'){
					$('#thongtuyen_bhxh').prop('checked', false);
					$('#suatt_cbx_dungtuyen').prop('checked', true);
				}
				else
				{
					if($('#suatt_madangky').val().substring(0,2)=='66')
					{
						if($('#suatt_madangky').val() == '66234'||$('#suatt_madangky').val() == '66001'||$('#suatt_madangky').val() == '66235'||$('#suatt_madangky').val() == '66232'||$('#suatt_madangky').val() == '66233'||$('#suatt_madangky').val() == '66236'||$('#suatt_madangky').val() == '66002'||$('#suatt_madangky').val() == '66069')
						{
							$('#thongtuyen_bhxh').prop('checked', false);
							$('#suatt_cbx_dungtuyen').prop('checked', false);										
						}
						else
						{
							$('#thongtuyen_bhxh').prop('checked', true);
							$('#suatt_cbx_dungtuyen').prop('checked', true);
						}
					}
					else
					{
						if($('#suatt_madangky').val() =='97511')
							{
								$('#thongtuyen_bhxh').prop('checked', true);
								$('#suatt_cbx_dungtuyen').prop('checked', true);
							}
							else
							{
								$('#thongtuyen_bhxh').prop('checked', false);
								$('#suatt_cbx_dungtuyen').prop('checked', false);
							}
					}
				}

			}
			//kiemtratylehuong($('#suatt_sobhyt').val());
		});
		//Lấy thuốc vào y lệnh
		$('#soluong').keypress(function (e){if (e.keyCode==13&&$('#soluong').val()!="")
		{
			$('#ylenh').val($('#ylenh').val()+"-"+$('#tenthuongmai').val()+" x"+$('#soluong').val()+" (" +$('#cachdung').val()+")");
			
		}});
	}
	function kiemtratylehuong(madt) 
	{
		var madt = madt;
		var url = "https://yte-daklak.vnpthis.vn/web_his/kiemtrathebhyt?madt=" + madt.toUpperCase();
			$.ajax({
				url: url,
					//async: false
				}).done(function (data){
					var arr = data.toString().split(":");						
					$("#suatt_tilemiengiam").val(arr[1]);
					});
	}
	/* xuất excel
	$("#donvi_tinh").parent().append('<p></p><span id="exceller_hpg" class="button_shadow" style="padding: 0px 0px;text-align: center; width:190px;height:24px; background-color: #4CAF50;color: green;">Xuất excel</span>');
																$('#exceller_hpg').on('click', function () 
																{
																	var uri = 'data:application/vnd.ms-excel;base64,',
																	template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body><table>{table}</table></body></html>',
																	base64 = function(s) 
																	{
																	return window.btoa(unescape(encodeURIComponent(s)))
																	},
																	format = function(s, c) 
																		{
																			return s.replace(/{(\w+)}/g, function(m, p) 
																				{
																				return c[p];
																				})
																		}
																	var toExcel = document.getElementById("wstbl").innerHTML;
																	var ctx = {
																	  worksheet: name || '',
																	  table: toExcel
																	};
																	var link = document.createElement("a");
																	link.download = "dsbnravien_noi_tru.xls";
																	link.href = uri + base64(format(template, ctx))
																	link.click();	
																});	*/
}
/* sự kiện click chuột phải
$(document).bind('contextmenu','#right', function(e){
    e.preventDefault();
    //alert('hi there!');
	$('ul > li > .context-menu-item disabled').removeAttr("disabled");
	$('ul > li > .context-menu-item disabled').removeClass("disabled");
    return false;
})*/

