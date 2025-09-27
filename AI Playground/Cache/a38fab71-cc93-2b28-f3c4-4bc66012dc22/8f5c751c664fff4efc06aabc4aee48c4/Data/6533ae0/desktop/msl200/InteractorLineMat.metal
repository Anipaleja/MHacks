#include <metal_stdlib>
#include <simd/simd.h>
using namespace metal;
namespace SNAP_VS {
int sc_GetStereoViewIndex()
{
return 0;
}
}
#ifndef sc_TextureRenderingLayout_Regular
#define sc_TextureRenderingLayout_Regular 0
#define sc_TextureRenderingLayout_StereoInstancedClipped 1
#define sc_TextureRenderingLayout_StereoMultiview 2
#endif
// SCC_BACKEND_SHADER_FLAGS_BEGIN__
// SCC_BACKEND_SHADER_FLAG_DISABLE_FRUSTUM_CULLING
// SCC_BACKEND_SHADER_FLAGS_END__
//SG_REFLECTION_BEGIN(200)
//attribute vec4 boneData 5
//attribute vec3 blendShape0Pos 6
//attribute vec3 blendShape0Normal 12
//attribute vec3 blendShape1Pos 7
//attribute vec3 blendShape1Normal 13
//attribute vec3 blendShape2Pos 8
//attribute vec3 blendShape2Normal 14
//attribute vec3 blendShape3Pos 9
//attribute vec3 blendShape4Pos 10
//attribute vec3 blendShape5Pos 11
//attribute vec4 position 0
//attribute vec3 normal 1
//attribute vec4 tangent 2
//attribute vec2 texture0 3
//attribute vec2 texture1 4
//attribute vec4 color 18
//attribute vec3 direction 19
//attribute vec3 prevSegment 20
//attribute vec3 positionNext 15
//attribute vec3 positionPrevious 16
//attribute vec4 strandProperties 17
//output vec4 FragColor0 0
//output vec4 FragColor1 1
//output vec4 FragColor2 2
//output vec4 FragColor3 3
//sampler sampler intensityTextureSmpSC 0:16
//sampler sampler sc_ScreenTextureSmpSC 0:21
//texture texture2D intensityTexture 0:1:0:16
//texture texture2D sc_ScreenTexture 0:13:0:21
//ubo float sc_BonesUBO 0:0:96 {
//sc_Bone_t sc_Bones 0:[1]:96
//float4 sc_Bones.boneMatrix 0:[3]:16
//float4 sc_Bones.normalMatrix 48:[3]:16
//}
//ubo int UserUniforms 0:24:4576 {
//float4 sc_Time 1376
//float4 sc_UniformConstants 1392
//float4x4 sc_ViewProjectionMatrixArray 1680:[2]:64
//float4x4 sc_ModelViewMatrixArray 1936:[2]:64
//float4x4 sc_ProjectionMatrixArray 2384:[2]:64
//float4x4 sc_ProjectionMatrixInverseArray 2512:[2]:64
//float4x4 sc_ViewMatrixArray 2640:[2]:64
//float4x4 sc_PrevFrameViewProjectionMatrixArray 2896:[2]:64
//float4x4 sc_ModelMatrix 3024
//float4x4 sc_ModelMatrixInverse 3088
//float3x3 sc_NormalMatrix 3152
//float4x4 sc_PrevFrameModelMatrix 3248
//float4 sc_CurrentRenderTargetDims 3456
//sc_Camera_t sc_Camera 3472
//float3 sc_Camera.position 0
//float sc_Camera.aspect 16
//float2 sc_Camera.clipPlanes 24
//float sc_ShadowDensity 3504
//float4 sc_ShadowColor 3520
//float4x4 sc_ProjectorMatrix 3536
//float4 weights0 3616
//float4 weights1 3632
//float4 sc_StereoClipPlanes 3664:[2]:16
//float2 sc_TAAJitterOffset 3704
//float4 voxelization_params_0 3824
//float4 voxelization_params_frustum_lrbt 3840
//float4 voxelization_params_frustum_nf 3856
//float3 voxelization_params_camera_pos 3872
//float4x4 sc_ModelMatrixVoxelization 3888
//float correctedIntensity 3952
//float3x3 intensityTextureTransform 4016
//float4 intensityTextureUvMinMax 4064
//float4 intensityTextureBorderColor 4080
//int PreviewEnabled 4244
//int PreviewNodeID 4248
//float alphaTestThreshold 4252
//float startWidth 4256
//float endWidth 4260
//int visualStyle 4264
//float4 startColor 4272
//float4 endColor 4288
//float maxAlpha 4304
//bool Port_Value_N008 4308
//float Port_Input1_N014 4364
//float Port_Value3_N040 4416
//float Port_Value3_N060 4448
//float Port_Position1_N073 4504
//float Port_Value2_N067 4508
//float Port_Position2_N073 4512
//float Port_Position1_N070 4516
//float Port_Position1_N066 4520
//float4 Port_Value0_N077 4528
//float Port_Position1_N077 4544
//float4 Port_Value2_N077 4560
//}
//spec_const bool BLEND_MODE_AVERAGE 0 0
//spec_const bool BLEND_MODE_BRIGHT 1 0
//spec_const bool BLEND_MODE_COLOR_BURN 2 0
//spec_const bool BLEND_MODE_COLOR_DODGE 3 0
//spec_const bool BLEND_MODE_COLOR 4 0
//spec_const bool BLEND_MODE_DARKEN 5 0
//spec_const bool BLEND_MODE_DIFFERENCE 6 0
//spec_const bool BLEND_MODE_DIVIDE 7 0
//spec_const bool BLEND_MODE_DIVISION 8 0
//spec_const bool BLEND_MODE_EXCLUSION 9 0
//spec_const bool BLEND_MODE_FORGRAY 10 0
//spec_const bool BLEND_MODE_HARD_GLOW 11 0
//spec_const bool BLEND_MODE_HARD_LIGHT 12 0
//spec_const bool BLEND_MODE_HARD_MIX 13 0
//spec_const bool BLEND_MODE_HARD_PHOENIX 14 0
//spec_const bool BLEND_MODE_HARD_REFLECT 15 0
//spec_const bool BLEND_MODE_HUE 16 0
//spec_const bool BLEND_MODE_INTENSE 17 0
//spec_const bool BLEND_MODE_LIGHTEN 18 0
//spec_const bool BLEND_MODE_LINEAR_LIGHT 19 0
//spec_const bool BLEND_MODE_LUMINOSITY 20 0
//spec_const bool BLEND_MODE_NEGATION 21 0
//spec_const bool BLEND_MODE_NOTBRIGHT 22 0
//spec_const bool BLEND_MODE_OVERLAY 23 0
//spec_const bool BLEND_MODE_PIN_LIGHT 24 0
//spec_const bool BLEND_MODE_REALISTIC 25 0
//spec_const bool BLEND_MODE_SATURATION 26 0
//spec_const bool BLEND_MODE_SOFT_LIGHT 27 0
//spec_const bool BLEND_MODE_SUBTRACT 28 0
//spec_const bool BLEND_MODE_VIVID_LIGHT 29 0
//spec_const bool ENABLE_STIPPLE_PATTERN_TEST 30 0
//spec_const bool SC_USE_CLAMP_TO_BORDER_intensityTexture 31 0
//spec_const bool SC_USE_UV_MIN_MAX_intensityTexture 32 0
//spec_const bool SC_USE_UV_TRANSFORM_intensityTexture 33 0
//spec_const bool UseViewSpaceDepthVariant 34 1
//spec_const bool intensityTextureHasSwappedViews 35 0
//spec_const bool sc_BlendMode_AddWithAlphaFactor 36 0
//spec_const bool sc_BlendMode_Add 37 0
//spec_const bool sc_BlendMode_AlphaTest 38 0
//spec_const bool sc_BlendMode_AlphaToCoverage 39 0
//spec_const bool sc_BlendMode_ColoredGlass 40 0
//spec_const bool sc_BlendMode_Custom 41 0
//spec_const bool sc_BlendMode_Max 42 0
//spec_const bool sc_BlendMode_Min 43 0
//spec_const bool sc_BlendMode_MultiplyOriginal 44 0
//spec_const bool sc_BlendMode_Multiply 45 0
//spec_const bool sc_BlendMode_Normal 46 0
//spec_const bool sc_BlendMode_PremultipliedAlphaAuto 47 0
//spec_const bool sc_BlendMode_PremultipliedAlphaHardware 48 0
//spec_const bool sc_BlendMode_PremultipliedAlpha 49 0
//spec_const bool sc_BlendMode_Screen 50 0
//spec_const bool sc_DepthOnly 51 0
//spec_const bool sc_FramebufferFetch 52 0
//spec_const bool sc_MotionVectorsPass 53 0
//spec_const bool sc_OITCompositingPass 54 0
//spec_const bool sc_OITDepthBoundsPass 55 0
//spec_const bool sc_OITDepthGatherPass 56 0
//spec_const bool sc_OutputBounds 57 0
//spec_const bool sc_ProjectiveShadowsCaster 58 0
//spec_const bool sc_ProjectiveShadowsReceiver 59 0
//spec_const bool sc_RenderAlphaToColor 60 0
//spec_const bool sc_ScreenTextureHasSwappedViews 61 0
//spec_const bool sc_TAAEnabled 62 0
//spec_const bool sc_VertexBlendingUseNormals 63 0
//spec_const bool sc_VertexBlending 64 0
//spec_const bool sc_Voxelization 65 0
//spec_const int SC_SOFTWARE_WRAP_MODE_U_intensityTexture 66 -1
//spec_const int SC_SOFTWARE_WRAP_MODE_V_intensityTexture 67 -1
//spec_const int intensityTextureLayout 68 0
//spec_const int sc_DepthBufferMode 69 0
//spec_const int sc_RenderingSpace 70 -1
//spec_const int sc_ScreenTextureLayout 71 0
//spec_const int sc_ShaderCacheConstant 72 0
//spec_const int sc_SkinBonesCount 73 0
//spec_const int sc_StereoRenderingMode 74 0
//spec_const int sc_StereoRendering_IsClipDistanceEnabled 75 0
//SG_REFLECTION_END
constant bool BLEND_MODE_AVERAGE [[function_constant(0)]];
constant bool BLEND_MODE_AVERAGE_tmp = is_function_constant_defined(BLEND_MODE_AVERAGE) ? BLEND_MODE_AVERAGE : false;
constant bool BLEND_MODE_BRIGHT [[function_constant(1)]];
constant bool BLEND_MODE_BRIGHT_tmp = is_function_constant_defined(BLEND_MODE_BRIGHT) ? BLEND_MODE_BRIGHT : false;
constant bool BLEND_MODE_COLOR_BURN [[function_constant(2)]];
constant bool BLEND_MODE_COLOR_BURN_tmp = is_function_constant_defined(BLEND_MODE_COLOR_BURN) ? BLEND_MODE_COLOR_BURN : false;
constant bool BLEND_MODE_COLOR_DODGE [[function_constant(3)]];
constant bool BLEND_MODE_COLOR_DODGE_tmp = is_function_constant_defined(BLEND_MODE_COLOR_DODGE) ? BLEND_MODE_COLOR_DODGE : false;
constant bool BLEND_MODE_COLOR [[function_constant(4)]];
constant bool BLEND_MODE_COLOR_tmp = is_function_constant_defined(BLEND_MODE_COLOR) ? BLEND_MODE_COLOR : false;
constant bool BLEND_MODE_DARKEN [[function_constant(5)]];
constant bool BLEND_MODE_DARKEN_tmp = is_function_constant_defined(BLEND_MODE_DARKEN) ? BLEND_MODE_DARKEN : false;
constant bool BLEND_MODE_DIFFERENCE [[function_constant(6)]];
constant bool BLEND_MODE_DIFFERENCE_tmp = is_function_constant_defined(BLEND_MODE_DIFFERENCE) ? BLEND_MODE_DIFFERENCE : false;
constant bool BLEND_MODE_DIVIDE [[function_constant(7)]];
constant bool BLEND_MODE_DIVIDE_tmp = is_function_constant_defined(BLEND_MODE_DIVIDE) ? BLEND_MODE_DIVIDE : false;
constant bool BLEND_MODE_DIVISION [[function_constant(8)]];
constant bool BLEND_MODE_DIVISION_tmp = is_function_constant_defined(BLEND_MODE_DIVISION) ? BLEND_MODE_DIVISION : false;
constant bool BLEND_MODE_EXCLUSION [[function_constant(9)]];
constant bool BLEND_MODE_EXCLUSION_tmp = is_function_constant_defined(BLEND_MODE_EXCLUSION) ? BLEND_MODE_EXCLUSION : false;
constant bool BLEND_MODE_FORGRAY [[function_constant(10)]];
constant bool BLEND_MODE_FORGRAY_tmp = is_function_constant_defined(BLEND_MODE_FORGRAY) ? BLEND_MODE_FORGRAY : false;
constant bool BLEND_MODE_HARD_GLOW [[function_constant(11)]];
constant bool BLEND_MODE_HARD_GLOW_tmp = is_function_constant_defined(BLEND_MODE_HARD_GLOW) ? BLEND_MODE_HARD_GLOW : false;
constant bool BLEND_MODE_HARD_LIGHT [[function_constant(12)]];
constant bool BLEND_MODE_HARD_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_HARD_LIGHT) ? BLEND_MODE_HARD_LIGHT : false;
constant bool BLEND_MODE_HARD_MIX [[function_constant(13)]];
constant bool BLEND_MODE_HARD_MIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_MIX) ? BLEND_MODE_HARD_MIX : false;
constant bool BLEND_MODE_HARD_PHOENIX [[function_constant(14)]];
constant bool BLEND_MODE_HARD_PHOENIX_tmp = is_function_constant_defined(BLEND_MODE_HARD_PHOENIX) ? BLEND_MODE_HARD_PHOENIX : false;
constant bool BLEND_MODE_HARD_REFLECT [[function_constant(15)]];
constant bool BLEND_MODE_HARD_REFLECT_tmp = is_function_constant_defined(BLEND_MODE_HARD_REFLECT) ? BLEND_MODE_HARD_REFLECT : false;
constant bool BLEND_MODE_HUE [[function_constant(16)]];
constant bool BLEND_MODE_HUE_tmp = is_function_constant_defined(BLEND_MODE_HUE) ? BLEND_MODE_HUE : false;
constant bool BLEND_MODE_INTENSE [[function_constant(17)]];
constant bool BLEND_MODE_INTENSE_tmp = is_function_constant_defined(BLEND_MODE_INTENSE) ? BLEND_MODE_INTENSE : false;
constant bool BLEND_MODE_LIGHTEN [[function_constant(18)]];
constant bool BLEND_MODE_LIGHTEN_tmp = is_function_constant_defined(BLEND_MODE_LIGHTEN) ? BLEND_MODE_LIGHTEN : false;
constant bool BLEND_MODE_LINEAR_LIGHT [[function_constant(19)]];
constant bool BLEND_MODE_LINEAR_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_LINEAR_LIGHT) ? BLEND_MODE_LINEAR_LIGHT : false;
constant bool BLEND_MODE_LUMINOSITY [[function_constant(20)]];
constant bool BLEND_MODE_LUMINOSITY_tmp = is_function_constant_defined(BLEND_MODE_LUMINOSITY) ? BLEND_MODE_LUMINOSITY : false;
constant bool BLEND_MODE_NEGATION [[function_constant(21)]];
constant bool BLEND_MODE_NEGATION_tmp = is_function_constant_defined(BLEND_MODE_NEGATION) ? BLEND_MODE_NEGATION : false;
constant bool BLEND_MODE_NOTBRIGHT [[function_constant(22)]];
constant bool BLEND_MODE_NOTBRIGHT_tmp = is_function_constant_defined(BLEND_MODE_NOTBRIGHT) ? BLEND_MODE_NOTBRIGHT : false;
constant bool BLEND_MODE_OVERLAY [[function_constant(23)]];
constant bool BLEND_MODE_OVERLAY_tmp = is_function_constant_defined(BLEND_MODE_OVERLAY) ? BLEND_MODE_OVERLAY : false;
constant bool BLEND_MODE_PIN_LIGHT [[function_constant(24)]];
constant bool BLEND_MODE_PIN_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_PIN_LIGHT) ? BLEND_MODE_PIN_LIGHT : false;
constant bool BLEND_MODE_REALISTIC [[function_constant(25)]];
constant bool BLEND_MODE_REALISTIC_tmp = is_function_constant_defined(BLEND_MODE_REALISTIC) ? BLEND_MODE_REALISTIC : false;
constant bool BLEND_MODE_SATURATION [[function_constant(26)]];
constant bool BLEND_MODE_SATURATION_tmp = is_function_constant_defined(BLEND_MODE_SATURATION) ? BLEND_MODE_SATURATION : false;
constant bool BLEND_MODE_SOFT_LIGHT [[function_constant(27)]];
constant bool BLEND_MODE_SOFT_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_SOFT_LIGHT) ? BLEND_MODE_SOFT_LIGHT : false;
constant bool BLEND_MODE_SUBTRACT [[function_constant(28)]];
constant bool BLEND_MODE_SUBTRACT_tmp = is_function_constant_defined(BLEND_MODE_SUBTRACT) ? BLEND_MODE_SUBTRACT : false;
constant bool BLEND_MODE_VIVID_LIGHT [[function_constant(29)]];
constant bool BLEND_MODE_VIVID_LIGHT_tmp = is_function_constant_defined(BLEND_MODE_VIVID_LIGHT) ? BLEND_MODE_VIVID_LIGHT : false;
constant bool ENABLE_STIPPLE_PATTERN_TEST [[function_constant(30)]];
constant bool ENABLE_STIPPLE_PATTERN_TEST_tmp = is_function_constant_defined(ENABLE_STIPPLE_PATTERN_TEST) ? ENABLE_STIPPLE_PATTERN_TEST : false;
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture [[function_constant(31)]];
constant bool SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp = is_function_constant_defined(SC_USE_CLAMP_TO_BORDER_intensityTexture) ? SC_USE_CLAMP_TO_BORDER_intensityTexture : false;
constant bool SC_USE_UV_MIN_MAX_intensityTexture [[function_constant(32)]];
constant bool SC_USE_UV_MIN_MAX_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_MIN_MAX_intensityTexture) ? SC_USE_UV_MIN_MAX_intensityTexture : false;
constant bool SC_USE_UV_TRANSFORM_intensityTexture [[function_constant(33)]];
constant bool SC_USE_UV_TRANSFORM_intensityTexture_tmp = is_function_constant_defined(SC_USE_UV_TRANSFORM_intensityTexture) ? SC_USE_UV_TRANSFORM_intensityTexture : false;
constant bool UseViewSpaceDepthVariant [[function_constant(34)]];
constant bool UseViewSpaceDepthVariant_tmp = is_function_constant_defined(UseViewSpaceDepthVariant) ? UseViewSpaceDepthVariant : true;
constant bool intensityTextureHasSwappedViews [[function_constant(35)]];
constant bool intensityTextureHasSwappedViews_tmp = is_function_constant_defined(intensityTextureHasSwappedViews) ? intensityTextureHasSwappedViews : false;
constant bool sc_BlendMode_AddWithAlphaFactor [[function_constant(36)]];
constant bool sc_BlendMode_AddWithAlphaFactor_tmp = is_function_constant_defined(sc_BlendMode_AddWithAlphaFactor) ? sc_BlendMode_AddWithAlphaFactor : false;
constant bool sc_BlendMode_Add [[function_constant(37)]];
constant bool sc_BlendMode_Add_tmp = is_function_constant_defined(sc_BlendMode_Add) ? sc_BlendMode_Add : false;
constant bool sc_BlendMode_AlphaTest [[function_constant(38)]];
constant bool sc_BlendMode_AlphaTest_tmp = is_function_constant_defined(sc_BlendMode_AlphaTest) ? sc_BlendMode_AlphaTest : false;
constant bool sc_BlendMode_AlphaToCoverage [[function_constant(39)]];
constant bool sc_BlendMode_AlphaToCoverage_tmp = is_function_constant_defined(sc_BlendMode_AlphaToCoverage) ? sc_BlendMode_AlphaToCoverage : false;
constant bool sc_BlendMode_ColoredGlass [[function_constant(40)]];
constant bool sc_BlendMode_ColoredGlass_tmp = is_function_constant_defined(sc_BlendMode_ColoredGlass) ? sc_BlendMode_ColoredGlass : false;
constant bool sc_BlendMode_Custom [[function_constant(41)]];
constant bool sc_BlendMode_Custom_tmp = is_function_constant_defined(sc_BlendMode_Custom) ? sc_BlendMode_Custom : false;
constant bool sc_BlendMode_Max [[function_constant(42)]];
constant bool sc_BlendMode_Max_tmp = is_function_constant_defined(sc_BlendMode_Max) ? sc_BlendMode_Max : false;
constant bool sc_BlendMode_Min [[function_constant(43)]];
constant bool sc_BlendMode_Min_tmp = is_function_constant_defined(sc_BlendMode_Min) ? sc_BlendMode_Min : false;
constant bool sc_BlendMode_MultiplyOriginal [[function_constant(44)]];
constant bool sc_BlendMode_MultiplyOriginal_tmp = is_function_constant_defined(sc_BlendMode_MultiplyOriginal) ? sc_BlendMode_MultiplyOriginal : false;
constant bool sc_BlendMode_Multiply [[function_constant(45)]];
constant bool sc_BlendMode_Multiply_tmp = is_function_constant_defined(sc_BlendMode_Multiply) ? sc_BlendMode_Multiply : false;
constant bool sc_BlendMode_Normal [[function_constant(46)]];
constant bool sc_BlendMode_Normal_tmp = is_function_constant_defined(sc_BlendMode_Normal) ? sc_BlendMode_Normal : false;
constant bool sc_BlendMode_PremultipliedAlphaAuto [[function_constant(47)]];
constant bool sc_BlendMode_PremultipliedAlphaAuto_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaAuto) ? sc_BlendMode_PremultipliedAlphaAuto : false;
constant bool sc_BlendMode_PremultipliedAlphaHardware [[function_constant(48)]];
constant bool sc_BlendMode_PremultipliedAlphaHardware_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlphaHardware) ? sc_BlendMode_PremultipliedAlphaHardware : false;
constant bool sc_BlendMode_PremultipliedAlpha [[function_constant(49)]];
constant bool sc_BlendMode_PremultipliedAlpha_tmp = is_function_constant_defined(sc_BlendMode_PremultipliedAlpha) ? sc_BlendMode_PremultipliedAlpha : false;
constant bool sc_BlendMode_Screen [[function_constant(50)]];
constant bool sc_BlendMode_Screen_tmp = is_function_constant_defined(sc_BlendMode_Screen) ? sc_BlendMode_Screen : false;
constant bool sc_DepthOnly [[function_constant(51)]];
constant bool sc_DepthOnly_tmp = is_function_constant_defined(sc_DepthOnly) ? sc_DepthOnly : false;
constant bool sc_FramebufferFetch [[function_constant(52)]];
constant bool sc_FramebufferFetch_tmp = is_function_constant_defined(sc_FramebufferFetch) ? sc_FramebufferFetch : false;
constant bool sc_MotionVectorsPass [[function_constant(53)]];
constant bool sc_MotionVectorsPass_tmp = is_function_constant_defined(sc_MotionVectorsPass) ? sc_MotionVectorsPass : false;
constant bool sc_OITCompositingPass [[function_constant(54)]];
constant bool sc_OITCompositingPass_tmp = is_function_constant_defined(sc_OITCompositingPass) ? sc_OITCompositingPass : false;
constant bool sc_OITDepthBoundsPass [[function_constant(55)]];
constant bool sc_OITDepthBoundsPass_tmp = is_function_constant_defined(sc_OITDepthBoundsPass) ? sc_OITDepthBoundsPass : false;
constant bool sc_OITDepthGatherPass [[function_constant(56)]];
constant bool sc_OITDepthGatherPass_tmp = is_function_constant_defined(sc_OITDepthGatherPass) ? sc_OITDepthGatherPass : false;
constant bool sc_OutputBounds [[function_constant(57)]];
constant bool sc_OutputBounds_tmp = is_function_constant_defined(sc_OutputBounds) ? sc_OutputBounds : false;
constant bool sc_ProjectiveShadowsCaster [[function_constant(58)]];
constant bool sc_ProjectiveShadowsCaster_tmp = is_function_constant_defined(sc_ProjectiveShadowsCaster) ? sc_ProjectiveShadowsCaster : false;
constant bool sc_ProjectiveShadowsReceiver [[function_constant(59)]];
constant bool sc_ProjectiveShadowsReceiver_tmp = is_function_constant_defined(sc_ProjectiveShadowsReceiver) ? sc_ProjectiveShadowsReceiver : false;
constant bool sc_RenderAlphaToColor [[function_constant(60)]];
constant bool sc_RenderAlphaToColor_tmp = is_function_constant_defined(sc_RenderAlphaToColor) ? sc_RenderAlphaToColor : false;
constant bool sc_ScreenTextureHasSwappedViews [[function_constant(61)]];
constant bool sc_ScreenTextureHasSwappedViews_tmp = is_function_constant_defined(sc_ScreenTextureHasSwappedViews) ? sc_ScreenTextureHasSwappedViews : false;
constant bool sc_TAAEnabled [[function_constant(62)]];
constant bool sc_TAAEnabled_tmp = is_function_constant_defined(sc_TAAEnabled) ? sc_TAAEnabled : false;
constant bool sc_VertexBlendingUseNormals [[function_constant(63)]];
constant bool sc_VertexBlendingUseNormals_tmp = is_function_constant_defined(sc_VertexBlendingUseNormals) ? sc_VertexBlendingUseNormals : false;
constant bool sc_VertexBlending [[function_constant(64)]];
constant bool sc_VertexBlending_tmp = is_function_constant_defined(sc_VertexBlending) ? sc_VertexBlending : false;
constant bool sc_Voxelization [[function_constant(65)]];
constant bool sc_Voxelization_tmp = is_function_constant_defined(sc_Voxelization) ? sc_Voxelization : false;
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture [[function_constant(66)]];
constant int SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_U_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_U_intensityTexture : -1;
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture [[function_constant(67)]];
constant int SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp = is_function_constant_defined(SC_SOFTWARE_WRAP_MODE_V_intensityTexture) ? SC_SOFTWARE_WRAP_MODE_V_intensityTexture : -1;
constant int intensityTextureLayout [[function_constant(68)]];
constant int intensityTextureLayout_tmp = is_function_constant_defined(intensityTextureLayout) ? intensityTextureLayout : 0;
constant int sc_DepthBufferMode [[function_constant(69)]];
constant int sc_DepthBufferMode_tmp = is_function_constant_defined(sc_DepthBufferMode) ? sc_DepthBufferMode : 0;
constant int sc_RenderingSpace [[function_constant(70)]];
constant int sc_RenderingSpace_tmp = is_function_constant_defined(sc_RenderingSpace) ? sc_RenderingSpace : -1;
constant int sc_ScreenTextureLayout [[function_constant(71)]];
constant int sc_ScreenTextureLayout_tmp = is_function_constant_defined(sc_ScreenTextureLayout) ? sc_ScreenTextureLayout : 0;
constant int sc_ShaderCacheConstant [[function_constant(72)]];
constant int sc_ShaderCacheConstant_tmp = is_function_constant_defined(sc_ShaderCacheConstant) ? sc_ShaderCacheConstant : 0;
constant int sc_SkinBonesCount [[function_constant(73)]];
constant int sc_SkinBonesCount_tmp = is_function_constant_defined(sc_SkinBonesCount) ? sc_SkinBonesCount : 0;
constant int sc_StereoRenderingMode [[function_constant(74)]];
constant int sc_StereoRenderingMode_tmp = is_function_constant_defined(sc_StereoRenderingMode) ? sc_StereoRenderingMode : 0;
constant int sc_StereoRendering_IsClipDistanceEnabled [[function_constant(75)]];
constant int sc_StereoRendering_IsClipDistanceEnabled_tmp = is_function_constant_defined(sc_StereoRendering_IsClipDistanceEnabled) ? sc_StereoRendering_IsClipDistanceEnabled : 0;

namespace SNAP_VS {
struct sc_Vertex_t
{
float4 position;
float3 normal;
float3 tangent;
float2 texture0;
float2 texture1;
};
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float2 Surface_UVCoord0;
float3 SurfacePosition_WorldSpace;
float3 ViewDirWS;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float startWidth;
float endWidth;
int visualStyle;
float4 startColor;
float4 endColor;
float maxAlpha;
int Port_Value_N008;
float3 Port_Import_N042;
float3 Port_Import_N043;
float Port_Import_N020;
float Port_Import_N021;
float Port_Import_N019;
float Port_Input1_N014;
float Port_Import_N044;
float3 Port_Import_N052;
float3 Port_Import_N016;
float Port_Value3_N040;
float Port_Import_N064;
float3 Port_Import_N028;
float Port_Value3_N060;
float Port_Import_N074;
float4 Port_Import_N032;
float4 Port_Import_N033;
float Port_Import_N034;
float Port_Import_N076;
float Port_Position1_N073;
float Port_Value2_N067;
float Port_Position2_N073;
float Port_Position1_N070;
float Port_Position1_N066;
float4 Port_Value0_N077;
float Port_Position1_N077;
float4 Port_Value2_N077;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_Set0
{
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> intensityTexture [[id(1)]];
texture2d<float> sc_ScreenTexture [[id(13)]];
sampler intensityTextureSmpSC [[id(16)]];
sampler sc_ScreenTextureSmpSC [[id(21)]];
constant userUniformsObj* UserUniforms [[id(24)]];
};
struct main_vert_out
{
float3 varPos [[user(locn0)]];
float3 varNormal [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varPackedTex [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
float4 gl_Position [[position]];
};
struct main_vert_in
{
float4 position [[attribute(0)]];
float3 normal [[attribute(1)]];
float4 tangent [[attribute(2)]];
float2 texture0 [[attribute(3)]];
float2 texture1 [[attribute(4)]];
float4 boneData [[attribute(5)]];
float3 blendShape0Pos [[attribute(6)]];
float3 blendShape1Pos [[attribute(7)]];
float3 blendShape2Pos [[attribute(8)]];
float3 blendShape3Pos [[attribute(9)]];
float3 blendShape4Pos [[attribute(10)]];
float3 blendShape5Pos [[attribute(11)]];
float3 blendShape0Normal [[attribute(12)]];
float3 blendShape1Normal [[attribute(13)]];
float3 blendShape2Normal [[attribute(14)]];
float3 positionNext [[attribute(15)]];
float3 positionPrevious [[attribute(16)]];
float4 strandProperties [[attribute(17)]];
float4 color [[attribute(18)]];
float3 direction [[attribute(19)]];
float3 prevSegment [[attribute(20)]];
};
vertex main_vert_out main_vert(main_vert_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],uint gl_InstanceIndex [[instance_id]])
{
main_vert_out out={};
out.PreviewVertexColor=float4(0.5);
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=float4(0.5);
PreviewInfo.Saved=false;
out.PreviewVertexSaved=0.0;
sc_Vertex_t l9_0;
l9_0.position=in.position;
l9_0.normal=in.normal;
l9_0.tangent=in.tangent.xyz;
l9_0.texture0=in.texture0;
l9_0.texture1=in.texture1;
sc_Vertex_t l9_1=l9_0;
sc_Vertex_t param=l9_1;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_2=param;
param=l9_2;
}
sc_Vertex_t l9_3=param;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_4=l9_3;
float3 l9_5=in.blendShape0Pos;
float3 l9_6=in.blendShape0Normal;
float l9_7=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_8=l9_4;
float3 l9_9=l9_5;
float l9_10=l9_7;
float3 l9_11=l9_8.position.xyz+(l9_9*l9_10);
l9_8.position=float4(l9_11.x,l9_11.y,l9_11.z,l9_8.position.w);
l9_4=l9_8;
l9_4.normal+=(l9_6*l9_7);
l9_3=l9_4;
sc_Vertex_t l9_12=l9_3;
float3 l9_13=in.blendShape1Pos;
float3 l9_14=in.blendShape1Normal;
float l9_15=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_16=l9_12;
float3 l9_17=l9_13;
float l9_18=l9_15;
float3 l9_19=l9_16.position.xyz+(l9_17*l9_18);
l9_16.position=float4(l9_19.x,l9_19.y,l9_19.z,l9_16.position.w);
l9_12=l9_16;
l9_12.normal+=(l9_14*l9_15);
l9_3=l9_12;
sc_Vertex_t l9_20=l9_3;
float3 l9_21=in.blendShape2Pos;
float3 l9_22=in.blendShape2Normal;
float l9_23=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_24=l9_20;
float3 l9_25=l9_21;
float l9_26=l9_23;
float3 l9_27=l9_24.position.xyz+(l9_25*l9_26);
l9_24.position=float4(l9_27.x,l9_27.y,l9_27.z,l9_24.position.w);
l9_20=l9_24;
l9_20.normal+=(l9_22*l9_23);
l9_3=l9_20;
}
else
{
sc_Vertex_t l9_28=l9_3;
float3 l9_29=in.blendShape0Pos;
float l9_30=(*sc_set0.UserUniforms).weights0.x;
float3 l9_31=l9_28.position.xyz+(l9_29*l9_30);
l9_28.position=float4(l9_31.x,l9_31.y,l9_31.z,l9_28.position.w);
l9_3=l9_28;
sc_Vertex_t l9_32=l9_3;
float3 l9_33=in.blendShape1Pos;
float l9_34=(*sc_set0.UserUniforms).weights0.y;
float3 l9_35=l9_32.position.xyz+(l9_33*l9_34);
l9_32.position=float4(l9_35.x,l9_35.y,l9_35.z,l9_32.position.w);
l9_3=l9_32;
sc_Vertex_t l9_36=l9_3;
float3 l9_37=in.blendShape2Pos;
float l9_38=(*sc_set0.UserUniforms).weights0.z;
float3 l9_39=l9_36.position.xyz+(l9_37*l9_38);
l9_36.position=float4(l9_39.x,l9_39.y,l9_39.z,l9_36.position.w);
l9_3=l9_36;
sc_Vertex_t l9_40=l9_3;
float3 l9_41=in.blendShape3Pos;
float l9_42=(*sc_set0.UserUniforms).weights0.w;
float3 l9_43=l9_40.position.xyz+(l9_41*l9_42);
l9_40.position=float4(l9_43.x,l9_43.y,l9_43.z,l9_40.position.w);
l9_3=l9_40;
sc_Vertex_t l9_44=l9_3;
float3 l9_45=in.blendShape4Pos;
float l9_46=(*sc_set0.UserUniforms).weights1.x;
float3 l9_47=l9_44.position.xyz+(l9_45*l9_46);
l9_44.position=float4(l9_47.x,l9_47.y,l9_47.z,l9_44.position.w);
l9_3=l9_44;
sc_Vertex_t l9_48=l9_3;
float3 l9_49=in.blendShape5Pos;
float l9_50=(*sc_set0.UserUniforms).weights1.y;
float3 l9_51=l9_48.position.xyz+(l9_49*l9_50);
l9_48.position=float4(l9_51.x,l9_51.y,l9_51.z,l9_48.position.w);
l9_3=l9_48;
}
}
param=l9_3;
sc_Vertex_t l9_52=param;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_53=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_53=float4(1.0,fract(in.boneData.yzw));
l9_53.x-=dot(l9_53.yzw,float3(1.0));
}
float4 l9_54=l9_53;
float4 l9_55=l9_54;
int l9_56=int(in.boneData.x);
int l9_57=int(in.boneData.y);
int l9_58=int(in.boneData.z);
int l9_59=int(in.boneData.w);
int l9_60=l9_56;
float4 l9_61=l9_52.position;
float3 l9_62=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_63=l9_60;
float4 l9_64=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[0];
float4 l9_65=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[1];
float4 l9_66=(*sc_set0.sc_BonesUBO).sc_Bones[l9_63].boneMatrix[2];
float4 l9_67[3];
l9_67[0]=l9_64;
l9_67[1]=l9_65;
l9_67[2]=l9_66;
l9_62=float3(dot(l9_61,l9_67[0]),dot(l9_61,l9_67[1]),dot(l9_61,l9_67[2]));
}
else
{
l9_62=l9_61.xyz;
}
float3 l9_68=l9_62;
float3 l9_69=l9_68;
float l9_70=l9_55.x;
int l9_71=l9_57;
float4 l9_72=l9_52.position;
float3 l9_73=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_74=l9_71;
float4 l9_75=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[0];
float4 l9_76=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[1];
float4 l9_77=(*sc_set0.sc_BonesUBO).sc_Bones[l9_74].boneMatrix[2];
float4 l9_78[3];
l9_78[0]=l9_75;
l9_78[1]=l9_76;
l9_78[2]=l9_77;
l9_73=float3(dot(l9_72,l9_78[0]),dot(l9_72,l9_78[1]),dot(l9_72,l9_78[2]));
}
else
{
l9_73=l9_72.xyz;
}
float3 l9_79=l9_73;
float3 l9_80=l9_79;
float l9_81=l9_55.y;
int l9_82=l9_58;
float4 l9_83=l9_52.position;
float3 l9_84=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_85=l9_82;
float4 l9_86=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[0];
float4 l9_87=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[1];
float4 l9_88=(*sc_set0.sc_BonesUBO).sc_Bones[l9_85].boneMatrix[2];
float4 l9_89[3];
l9_89[0]=l9_86;
l9_89[1]=l9_87;
l9_89[2]=l9_88;
l9_84=float3(dot(l9_83,l9_89[0]),dot(l9_83,l9_89[1]),dot(l9_83,l9_89[2]));
}
else
{
l9_84=l9_83.xyz;
}
float3 l9_90=l9_84;
float3 l9_91=l9_90;
float l9_92=l9_55.z;
int l9_93=l9_59;
float4 l9_94=l9_52.position;
float3 l9_95=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_96=l9_93;
float4 l9_97=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[0];
float4 l9_98=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[1];
float4 l9_99=(*sc_set0.sc_BonesUBO).sc_Bones[l9_96].boneMatrix[2];
float4 l9_100[3];
l9_100[0]=l9_97;
l9_100[1]=l9_98;
l9_100[2]=l9_99;
l9_95=float3(dot(l9_94,l9_100[0]),dot(l9_94,l9_100[1]),dot(l9_94,l9_100[2]));
}
else
{
l9_95=l9_94.xyz;
}
float3 l9_101=l9_95;
float3 l9_102=(((l9_69*l9_70)+(l9_80*l9_81))+(l9_91*l9_92))+(l9_101*l9_55.w);
l9_52.position=float4(l9_102.x,l9_102.y,l9_102.z,l9_52.position.w);
int l9_103=l9_56;
float3x3 l9_104=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_103].normalMatrix[2].xyz));
float3x3 l9_105=l9_104;
float3x3 l9_106=l9_105;
int l9_107=l9_57;
float3x3 l9_108=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_107].normalMatrix[2].xyz));
float3x3 l9_109=l9_108;
float3x3 l9_110=l9_109;
int l9_111=l9_58;
float3x3 l9_112=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_111].normalMatrix[2].xyz));
float3x3 l9_113=l9_112;
float3x3 l9_114=l9_113;
int l9_115=l9_59;
float3x3 l9_116=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_115].normalMatrix[2].xyz));
float3x3 l9_117=l9_116;
float3x3 l9_118=l9_117;
l9_52.normal=((((l9_106*l9_52.normal)*l9_55.x)+((l9_110*l9_52.normal)*l9_55.y))+((l9_114*l9_52.normal)*l9_55.z))+((l9_118*l9_52.normal)*l9_55.w);
l9_52.tangent=((((l9_106*l9_52.tangent)*l9_55.x)+((l9_110*l9_52.tangent)*l9_55.y))+((l9_114*l9_52.tangent)*l9_55.z))+((l9_118*l9_52.tangent)*l9_55.w);
}
param=l9_52;
if (sc_RenderingSpace_tmp==3)
{
out.varPos=float3(0.0);
out.varNormal=param.normal;
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==4)
{
out.varPos=float3(0.0);
out.varNormal=param.normal;
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
out.varPos=param.position.xyz;
out.varNormal=param.normal;
out.varTangent=float4(param.tangent.x,param.tangent.y,param.tangent.z,out.varTangent.w);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
out.varPos=((*sc_set0.UserUniforms).sc_ModelMatrix*param.position).xyz;
out.varNormal=(*sc_set0.UserUniforms).sc_NormalMatrix*param.normal;
float3 l9_119=(*sc_set0.UserUniforms).sc_NormalMatrix*param.tangent;
out.varTangent=float4(l9_119.x,l9_119.y,l9_119.z,out.varTangent.w);
}
}
}
}
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
param.texture0.x=1.0-param.texture0.x;
}
out.varColor=in.color;
sc_Vertex_t v=param;
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.Surface_UVCoord0=v.texture0;
Globals.SurfacePosition_WorldSpace=out.varPos;
Globals.ViewDirWS=normalize((*sc_set0.UserUniforms).sc_Camera.position-Globals.SurfacePosition_WorldSpace);
float3 WorldPosition=out.varPos;
float3 WorldNormal=out.varNormal;
float3 WorldTangent=out.varTangent.xyz;
float3 Result_N3=float3(0.0);
float param_1=0.0;
float3 param_2=float3(0.0);
float3 param_3=float3(1.0,0.0,0.0);
ssGlobals param_5=Globals;
float2 l9_120=float2(0.0);
l9_120=param_5.Surface_UVCoord0;
float l9_121=0.0;
float2 l9_122=l9_120;
float l9_123=l9_122.x;
l9_121=l9_123;
param_1=l9_121;
float3 param_4;
if ((param_1*1.0)!=0.0)
{
float3 l9_124=float3(0.0);
l9_124=param_5.SurfacePosition_WorldSpace;
float3 l9_125=float3(0.0);
float l9_126=0.0;
float3 l9_127=float3(0.0);
float3 l9_128=float3(0.0);
ssGlobals l9_129=param_5;
float l9_130=0.0;
bool l9_131=(*sc_set0.UserUniforms).Port_Value_N008!=0;
float l9_132=l9_131 ? 1.001 : 0.001;
l9_132-=0.001;
l9_130=l9_132;
l9_126=l9_130;
float3 l9_133;
if ((l9_126*1.0)!=0.0)
{
float3 l9_134=float3(0.0);
l9_134=l9_129.ViewDirWS;
float3 l9_135=float3(0.0);
l9_135=l9_134;
float3 l9_136=float3(0.0);
float3 l9_137=l9_135;
float l9_138=dot(l9_137,l9_137);
float l9_139;
if (l9_138>0.0)
{
l9_139=1.0/sqrt(l9_138);
}
else
{
l9_139=0.0;
}
float l9_140=l9_139;
float3 l9_141=l9_137*l9_140;
l9_136=l9_141;
float3 l9_142=float3(0.0);
float3 l9_143=float3(in.direction);
l9_142=l9_143;
float3 l9_144=float3(0.0);
l9_144=l9_142;
float3 l9_145=float3(0.0);
float3 l9_146=l9_144;
float l9_147=dot(l9_146,l9_146);
float l9_148;
if (l9_147>0.0)
{
l9_148=1.0/sqrt(l9_147);
}
else
{
l9_148=0.0;
}
float l9_149=l9_148;
float3 l9_150=l9_146*l9_149;
l9_145=l9_150;
float3 l9_151=float3(0.0);
l9_151=cross(l9_136,l9_145);
float3 l9_152=float3(0.0);
float3 l9_153=l9_151;
float l9_154=dot(l9_153,l9_153);
float l9_155;
if (l9_154>0.0)
{
l9_155=1.0/sqrt(l9_154);
}
else
{
l9_155=0.0;
}
float l9_156=l9_155;
float3 l9_157=l9_153*l9_156;
l9_152=l9_157;
float l9_158=0.0;
float l9_159=(*sc_set0.UserUniforms).startWidth;
l9_158=l9_159;
float l9_160=0.0;
l9_160=l9_158;
float2 l9_161=float2(0.0);
l9_161=l9_129.Surface_UVCoord0;
float l9_162=0.0;
float2 l9_163=l9_161;
float l9_164=l9_163.y;
l9_162=l9_164;
float l9_165=0.0;
l9_165=l9_162;
float l9_166=0.0;
l9_166=l9_160*l9_165;
float l9_167=0.0;
float l9_168=(*sc_set0.UserUniforms).endWidth;
l9_167=l9_168;
float l9_169=0.0;
l9_169=l9_167;
float l9_170=0.0;
l9_170=1.0-l9_165;
float l9_171=0.0;
l9_171=l9_169*l9_170;
float l9_172=0.0;
l9_172=l9_166+l9_171;
float l9_173=0.0;
l9_173=l9_172/(*sc_set0.UserUniforms).Port_Input1_N014;
float l9_174=0.0;
l9_174=l9_173;
float l9_175=0.0;
l9_175=l9_174;
float3 l9_176=float3(0.0);
float3 l9_177=float3(in.prevSegment);
l9_176=l9_177;
float3 l9_178=float3(0.0);
l9_178=l9_176;
float3 l9_179=float3(0.0);
float3 l9_180=l9_178;
float l9_181=dot(l9_180,l9_180);
float l9_182;
if (l9_181>0.0)
{
l9_182=1.0/sqrt(l9_181);
}
else
{
l9_182=0.0;
}
float l9_183=l9_182;
float3 l9_184=l9_180*l9_183;
l9_179=l9_184;
float3 l9_185=float3(0.0);
l9_185=cross(l9_135,l9_179);
float l9_186=0.0;
l9_186=dot(l9_152,l9_185);
float l9_187=0.0;
l9_187=l9_175/l9_186;
float3 l9_188=float3(0.0);
l9_188=l9_152*float3(l9_187);
float3 l9_189=float3(0.0);
l9_189=l9_188;
l9_127=l9_189;
l9_133=l9_127;
}
else
{
float3 l9_190=float3(0.0);
float3 l9_191=float3(in.direction);
l9_190=l9_191;
float3 l9_192=float3(0.0);
l9_192=l9_190;
float l9_193=0.0;
float l9_194=0.0;
float3 l9_195=l9_192;
float l9_196=l9_195.x;
float l9_197=l9_195.y;
l9_193=l9_196;
l9_194=l9_197;
float l9_198=0.0;
l9_198=-l9_194;
float3 l9_199=float3(0.0);
l9_199.x=l9_198;
l9_199.y=l9_193;
l9_199.z=(*sc_set0.UserUniforms).Port_Value3_N040;
float l9_200=0.0;
float l9_201=(*sc_set0.UserUniforms).startWidth;
l9_200=l9_201;
float l9_202=0.0;
l9_202=l9_200;
float2 l9_203=float2(0.0);
l9_203=l9_129.Surface_UVCoord0;
float l9_204=0.0;
float2 l9_205=l9_203;
float l9_206=l9_205.y;
l9_204=l9_206;
float l9_207=0.0;
l9_207=l9_204;
float l9_208=0.0;
l9_208=l9_202*l9_207;
float l9_209=0.0;
float l9_210=(*sc_set0.UserUniforms).endWidth;
l9_209=l9_210;
float l9_211=0.0;
l9_211=l9_209;
float l9_212=0.0;
l9_212=1.0-l9_207;
float l9_213=0.0;
l9_213=l9_211*l9_212;
float l9_214=0.0;
l9_214=l9_208+l9_213;
float l9_215=0.0;
l9_215=l9_214/(*sc_set0.UserUniforms).Port_Input1_N014;
float l9_216=0.0;
l9_216=l9_215;
float l9_217=0.0;
l9_217=l9_216;
float3 l9_218=float3(0.0);
float3 l9_219=float3(in.prevSegment);
l9_218=l9_219;
float3 l9_220=float3(0.0);
l9_220=l9_218;
float l9_221=0.0;
float l9_222=0.0;
float3 l9_223=l9_220;
float l9_224=l9_223.x;
float l9_225=l9_223.y;
l9_221=l9_224;
l9_222=l9_225;
float l9_226=0.0;
l9_226=-l9_222;
float3 l9_227=float3(0.0);
l9_227.x=l9_226;
l9_227.y=l9_221;
l9_227.z=(*sc_set0.UserUniforms).Port_Value3_N060;
float l9_228=0.0;
l9_228=dot(l9_199,l9_227);
float l9_229=0.0;
l9_229=l9_217/l9_228;
float3 l9_230=float3(0.0);
l9_230=l9_199*float3(l9_229);
float3 l9_231=float3(0.0);
l9_231=l9_230;
l9_128=l9_231;
l9_133=l9_128;
}
l9_125=l9_133;
float3 l9_232=float3(0.0);
l9_232=l9_124-l9_125;
param_2=l9_232;
param_4=param_2;
}
else
{
float3 l9_233=float3(0.0);
l9_233=param_5.SurfacePosition_WorldSpace;
float3 l9_234=float3(0.0);
float l9_235=0.0;
float3 l9_236=float3(0.0);
float3 l9_237=float3(0.0);
ssGlobals l9_238=param_5;
float l9_239=0.0;
bool l9_240=(*sc_set0.UserUniforms).Port_Value_N008!=0;
float l9_241=l9_240 ? 1.001 : 0.001;
l9_241-=0.001;
l9_239=l9_241;
l9_235=l9_239;
float3 l9_242;
if ((l9_235*1.0)!=0.0)
{
float3 l9_243=float3(0.0);
l9_243=l9_238.ViewDirWS;
float3 l9_244=float3(0.0);
l9_244=l9_243;
float3 l9_245=float3(0.0);
float3 l9_246=l9_244;
float l9_247=dot(l9_246,l9_246);
float l9_248;
if (l9_247>0.0)
{
l9_248=1.0/sqrt(l9_247);
}
else
{
l9_248=0.0;
}
float l9_249=l9_248;
float3 l9_250=l9_246*l9_249;
l9_245=l9_250;
float3 l9_251=float3(0.0);
float3 l9_252=float3(in.direction);
l9_251=l9_252;
float3 l9_253=float3(0.0);
l9_253=l9_251;
float3 l9_254=float3(0.0);
float3 l9_255=l9_253;
float l9_256=dot(l9_255,l9_255);
float l9_257;
if (l9_256>0.0)
{
l9_257=1.0/sqrt(l9_256);
}
else
{
l9_257=0.0;
}
float l9_258=l9_257;
float3 l9_259=l9_255*l9_258;
l9_254=l9_259;
float3 l9_260=float3(0.0);
l9_260=cross(l9_245,l9_254);
float3 l9_261=float3(0.0);
float3 l9_262=l9_260;
float l9_263=dot(l9_262,l9_262);
float l9_264;
if (l9_263>0.0)
{
l9_264=1.0/sqrt(l9_263);
}
else
{
l9_264=0.0;
}
float l9_265=l9_264;
float3 l9_266=l9_262*l9_265;
l9_261=l9_266;
float l9_267=0.0;
float l9_268=(*sc_set0.UserUniforms).startWidth;
l9_267=l9_268;
float l9_269=0.0;
l9_269=l9_267;
float2 l9_270=float2(0.0);
l9_270=l9_238.Surface_UVCoord0;
float l9_271=0.0;
float2 l9_272=l9_270;
float l9_273=l9_272.y;
l9_271=l9_273;
float l9_274=0.0;
l9_274=l9_271;
float l9_275=0.0;
l9_275=l9_269*l9_274;
float l9_276=0.0;
float l9_277=(*sc_set0.UserUniforms).endWidth;
l9_276=l9_277;
float l9_278=0.0;
l9_278=l9_276;
float l9_279=0.0;
l9_279=1.0-l9_274;
float l9_280=0.0;
l9_280=l9_278*l9_279;
float l9_281=0.0;
l9_281=l9_275+l9_280;
float l9_282=0.0;
l9_282=l9_281/(*sc_set0.UserUniforms).Port_Input1_N014;
float l9_283=0.0;
l9_283=l9_282;
float l9_284=0.0;
l9_284=l9_283;
float3 l9_285=float3(0.0);
float3 l9_286=float3(in.prevSegment);
l9_285=l9_286;
float3 l9_287=float3(0.0);
l9_287=l9_285;
float3 l9_288=float3(0.0);
float3 l9_289=l9_287;
float l9_290=dot(l9_289,l9_289);
float l9_291;
if (l9_290>0.0)
{
l9_291=1.0/sqrt(l9_290);
}
else
{
l9_291=0.0;
}
float l9_292=l9_291;
float3 l9_293=l9_289*l9_292;
l9_288=l9_293;
float3 l9_294=float3(0.0);
l9_294=cross(l9_244,l9_288);
float l9_295=0.0;
l9_295=dot(l9_261,l9_294);
float l9_296=0.0;
l9_296=l9_284/l9_295;
float3 l9_297=float3(0.0);
l9_297=l9_261*float3(l9_296);
float3 l9_298=float3(0.0);
l9_298=l9_297;
l9_236=l9_298;
l9_242=l9_236;
}
else
{
float3 l9_299=float3(0.0);
float3 l9_300=float3(in.direction);
l9_299=l9_300;
float3 l9_301=float3(0.0);
l9_301=l9_299;
float l9_302=0.0;
float l9_303=0.0;
float3 l9_304=l9_301;
float l9_305=l9_304.x;
float l9_306=l9_304.y;
l9_302=l9_305;
l9_303=l9_306;
float l9_307=0.0;
l9_307=-l9_303;
float3 l9_308=float3(0.0);
l9_308.x=l9_307;
l9_308.y=l9_302;
l9_308.z=(*sc_set0.UserUniforms).Port_Value3_N040;
float l9_309=0.0;
float l9_310=(*sc_set0.UserUniforms).startWidth;
l9_309=l9_310;
float l9_311=0.0;
l9_311=l9_309;
float2 l9_312=float2(0.0);
l9_312=l9_238.Surface_UVCoord0;
float l9_313=0.0;
float2 l9_314=l9_312;
float l9_315=l9_314.y;
l9_313=l9_315;
float l9_316=0.0;
l9_316=l9_313;
float l9_317=0.0;
l9_317=l9_311*l9_316;
float l9_318=0.0;
float l9_319=(*sc_set0.UserUniforms).endWidth;
l9_318=l9_319;
float l9_320=0.0;
l9_320=l9_318;
float l9_321=0.0;
l9_321=1.0-l9_316;
float l9_322=0.0;
l9_322=l9_320*l9_321;
float l9_323=0.0;
l9_323=l9_317+l9_322;
float l9_324=0.0;
l9_324=l9_323/(*sc_set0.UserUniforms).Port_Input1_N014;
float l9_325=0.0;
l9_325=l9_324;
float l9_326=0.0;
l9_326=l9_325;
float3 l9_327=float3(0.0);
float3 l9_328=float3(in.prevSegment);
l9_327=l9_328;
float3 l9_329=float3(0.0);
l9_329=l9_327;
float l9_330=0.0;
float l9_331=0.0;
float3 l9_332=l9_329;
float l9_333=l9_332.x;
float l9_334=l9_332.y;
l9_330=l9_333;
l9_331=l9_334;
float l9_335=0.0;
l9_335=-l9_331;
float3 l9_336=float3(0.0);
l9_336.x=l9_335;
l9_336.y=l9_330;
l9_336.z=(*sc_set0.UserUniforms).Port_Value3_N060;
float l9_337=0.0;
l9_337=dot(l9_308,l9_336);
float l9_338=0.0;
l9_338=l9_326/l9_337;
float3 l9_339=float3(0.0);
l9_339=l9_308*float3(l9_338);
float3 l9_340=float3(0.0);
l9_340=l9_339;
l9_237=l9_340;
l9_242=l9_237;
}
l9_234=l9_242;
float3 l9_341=float3(0.0);
l9_341=l9_233+l9_234;
param_3=l9_341;
param_4=param_3;
}
Result_N3=param_4;
WorldPosition=Result_N3;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
WorldPosition=out.varPos;
WorldNormal=out.varNormal;
WorldTangent=out.varTangent.xyz;
}
sc_Vertex_t param_6=v;
float3 param_7=WorldPosition;
float3 param_8=WorldNormal;
float3 param_9=WorldTangent;
float4 param_10=v.position;
out.varPos=param_7;
out.varNormal=normalize(param_8);
float3 l9_342=normalize(param_9);
out.varTangent=float4(l9_342.x,l9_342.y,l9_342.z,out.varTangent.w);
out.varTangent.w=in.tangent.w;
if ((int(UseViewSpaceDepthVariant_tmp)!=0)&&(((int(sc_OITDepthGatherPass_tmp)!=0)||(int(sc_OITCompositingPass_tmp)!=0))||(int(sc_OITDepthBoundsPass_tmp)!=0)))
{
float4 l9_343=param_6.position;
float4 l9_344=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
int l9_345=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_345=0;
}
else
{
l9_345=gl_InstanceIndex%2;
}
int l9_346=l9_345;
l9_344=(*sc_set0.UserUniforms).sc_ProjectionMatrixInverseArray[l9_346]*l9_343;
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_347=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_347=0;
}
else
{
l9_347=gl_InstanceIndex%2;
}
int l9_348=l9_347;
l9_344=(*sc_set0.UserUniforms).sc_ViewMatrixArray[l9_348]*l9_343;
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_349=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_349=0;
}
else
{
l9_349=gl_InstanceIndex%2;
}
int l9_350=l9_349;
l9_344=(*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_350]*l9_343;
}
else
{
l9_344=l9_343;
}
}
}
float4 l9_351=l9_344;
out.varViewSpaceDepth=-l9_351.z;
}
float4 l9_352=float4(0.0);
if (sc_RenderingSpace_tmp==3)
{
l9_352=param_10;
}
else
{
if (sc_RenderingSpace_tmp==4)
{
int l9_353=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_353=0;
}
else
{
l9_353=gl_InstanceIndex%2;
}
int l9_354=l9_353;
l9_352=((*sc_set0.UserUniforms).sc_ModelViewMatrixArray[l9_354]*param_6.position)*float4(1.0/(*sc_set0.UserUniforms).sc_Camera.aspect,1.0,1.0,1.0);
}
else
{
if (sc_RenderingSpace_tmp==2)
{
int l9_355=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_355=0;
}
else
{
l9_355=gl_InstanceIndex%2;
}
int l9_356=l9_355;
l9_352=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_356]*float4(out.varPos,1.0);
}
else
{
if (sc_RenderingSpace_tmp==1)
{
int l9_357=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_357=0;
}
else
{
l9_357=gl_InstanceIndex%2;
}
int l9_358=l9_357;
l9_352=(*sc_set0.UserUniforms).sc_ViewProjectionMatrixArray[l9_358]*float4(out.varPos,1.0);
}
}
}
}
out.varPackedTex=float4(param_6.texture0,param_6.texture1);
if ((int(sc_ProjectiveShadowsReceiver_tmp)!=0))
{
float4 l9_359=param_6.position;
float4 l9_360=l9_359;
if (sc_RenderingSpace_tmp==1)
{
l9_360=(*sc_set0.UserUniforms).sc_ModelMatrix*l9_359;
}
float4 l9_361=(*sc_set0.UserUniforms).sc_ProjectorMatrix*l9_360;
float2 l9_362=((l9_361.xy/float2(l9_361.w))*0.5)+float2(0.5);
out.varShadowTex=l9_362;
}
float4 l9_363=l9_352;
if (sc_DepthBufferMode_tmp==1)
{
int l9_364=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_364=0;
}
else
{
l9_364=gl_InstanceIndex%2;
}
int l9_365=l9_364;
if ((*sc_set0.UserUniforms).sc_ProjectionMatrixArray[l9_365][2].w!=0.0)
{
float l9_366=2.0/log2((*sc_set0.UserUniforms).sc_Camera.clipPlanes.y+1.0);
l9_363.z=((log2(fast::max((*sc_set0.UserUniforms).sc_Camera.clipPlanes.x,1.0+l9_363.w))*l9_366)-1.0)*l9_363.w;
}
}
float4 l9_367=l9_363;
l9_352=l9_367;
float4 l9_368=l9_352;
if ((int(sc_TAAEnabled_tmp)!=0))
{
float2 l9_369=l9_368.xy+((*sc_set0.UserUniforms).sc_TAAJitterOffset*l9_368.w);
l9_368=float4(l9_369.x,l9_369.y,l9_368.z,l9_368.w);
}
float4 l9_370=l9_368;
l9_352=l9_370;
float4 l9_371=l9_352;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_371.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_372=l9_371;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_373=dot(l9_372,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_374=l9_373;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_374;
}
}
float4 l9_375=float4(l9_371.x,-l9_371.y,(l9_371.z*0.5)+(l9_371.w*0.5),l9_371.w);
out.gl_Position=l9_375;
if ((int(sc_Voxelization_tmp)!=0))
{
sc_Vertex_t l9_377=param_6;
sc_Vertex_t l9_378=l9_377;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_379=l9_378;
float3 l9_380=in.blendShape0Pos;
float3 l9_381=in.blendShape0Normal;
float l9_382=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_383=l9_379;
float3 l9_384=l9_380;
float l9_385=l9_382;
float3 l9_386=l9_383.position.xyz+(l9_384*l9_385);
l9_383.position=float4(l9_386.x,l9_386.y,l9_386.z,l9_383.position.w);
l9_379=l9_383;
l9_379.normal+=(l9_381*l9_382);
l9_378=l9_379;
sc_Vertex_t l9_387=l9_378;
float3 l9_388=in.blendShape1Pos;
float3 l9_389=in.blendShape1Normal;
float l9_390=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_391=l9_387;
float3 l9_392=l9_388;
float l9_393=l9_390;
float3 l9_394=l9_391.position.xyz+(l9_392*l9_393);
l9_391.position=float4(l9_394.x,l9_394.y,l9_394.z,l9_391.position.w);
l9_387=l9_391;
l9_387.normal+=(l9_389*l9_390);
l9_378=l9_387;
sc_Vertex_t l9_395=l9_378;
float3 l9_396=in.blendShape2Pos;
float3 l9_397=in.blendShape2Normal;
float l9_398=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_399=l9_395;
float3 l9_400=l9_396;
float l9_401=l9_398;
float3 l9_402=l9_399.position.xyz+(l9_400*l9_401);
l9_399.position=float4(l9_402.x,l9_402.y,l9_402.z,l9_399.position.w);
l9_395=l9_399;
l9_395.normal+=(l9_397*l9_398);
l9_378=l9_395;
}
else
{
sc_Vertex_t l9_403=l9_378;
float3 l9_404=in.blendShape0Pos;
float l9_405=(*sc_set0.UserUniforms).weights0.x;
float3 l9_406=l9_403.position.xyz+(l9_404*l9_405);
l9_403.position=float4(l9_406.x,l9_406.y,l9_406.z,l9_403.position.w);
l9_378=l9_403;
sc_Vertex_t l9_407=l9_378;
float3 l9_408=in.blendShape1Pos;
float l9_409=(*sc_set0.UserUniforms).weights0.y;
float3 l9_410=l9_407.position.xyz+(l9_408*l9_409);
l9_407.position=float4(l9_410.x,l9_410.y,l9_410.z,l9_407.position.w);
l9_378=l9_407;
sc_Vertex_t l9_411=l9_378;
float3 l9_412=in.blendShape2Pos;
float l9_413=(*sc_set0.UserUniforms).weights0.z;
float3 l9_414=l9_411.position.xyz+(l9_412*l9_413);
l9_411.position=float4(l9_414.x,l9_414.y,l9_414.z,l9_411.position.w);
l9_378=l9_411;
sc_Vertex_t l9_415=l9_378;
float3 l9_416=in.blendShape3Pos;
float l9_417=(*sc_set0.UserUniforms).weights0.w;
float3 l9_418=l9_415.position.xyz+(l9_416*l9_417);
l9_415.position=float4(l9_418.x,l9_418.y,l9_418.z,l9_415.position.w);
l9_378=l9_415;
sc_Vertex_t l9_419=l9_378;
float3 l9_420=in.blendShape4Pos;
float l9_421=(*sc_set0.UserUniforms).weights1.x;
float3 l9_422=l9_419.position.xyz+(l9_420*l9_421);
l9_419.position=float4(l9_422.x,l9_422.y,l9_422.z,l9_419.position.w);
l9_378=l9_419;
sc_Vertex_t l9_423=l9_378;
float3 l9_424=in.blendShape5Pos;
float l9_425=(*sc_set0.UserUniforms).weights1.y;
float3 l9_426=l9_423.position.xyz+(l9_424*l9_425);
l9_423.position=float4(l9_426.x,l9_426.y,l9_426.z,l9_423.position.w);
l9_378=l9_423;
}
}
l9_377=l9_378;
sc_Vertex_t l9_427=l9_377;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_428=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_428=float4(1.0,fract(in.boneData.yzw));
l9_428.x-=dot(l9_428.yzw,float3(1.0));
}
float4 l9_429=l9_428;
float4 l9_430=l9_429;
int l9_431=int(in.boneData.x);
int l9_432=int(in.boneData.y);
int l9_433=int(in.boneData.z);
int l9_434=int(in.boneData.w);
int l9_435=l9_431;
float4 l9_436=l9_427.position;
float3 l9_437=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_438=l9_435;
float4 l9_439=(*sc_set0.sc_BonesUBO).sc_Bones[l9_438].boneMatrix[0];
float4 l9_440=(*sc_set0.sc_BonesUBO).sc_Bones[l9_438].boneMatrix[1];
float4 l9_441=(*sc_set0.sc_BonesUBO).sc_Bones[l9_438].boneMatrix[2];
float4 l9_442[3];
l9_442[0]=l9_439;
l9_442[1]=l9_440;
l9_442[2]=l9_441;
l9_437=float3(dot(l9_436,l9_442[0]),dot(l9_436,l9_442[1]),dot(l9_436,l9_442[2]));
}
else
{
l9_437=l9_436.xyz;
}
float3 l9_443=l9_437;
float3 l9_444=l9_443;
float l9_445=l9_430.x;
int l9_446=l9_432;
float4 l9_447=l9_427.position;
float3 l9_448=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_449=l9_446;
float4 l9_450=(*sc_set0.sc_BonesUBO).sc_Bones[l9_449].boneMatrix[0];
float4 l9_451=(*sc_set0.sc_BonesUBO).sc_Bones[l9_449].boneMatrix[1];
float4 l9_452=(*sc_set0.sc_BonesUBO).sc_Bones[l9_449].boneMatrix[2];
float4 l9_453[3];
l9_453[0]=l9_450;
l9_453[1]=l9_451;
l9_453[2]=l9_452;
l9_448=float3(dot(l9_447,l9_453[0]),dot(l9_447,l9_453[1]),dot(l9_447,l9_453[2]));
}
else
{
l9_448=l9_447.xyz;
}
float3 l9_454=l9_448;
float3 l9_455=l9_454;
float l9_456=l9_430.y;
int l9_457=l9_433;
float4 l9_458=l9_427.position;
float3 l9_459=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_460=l9_457;
float4 l9_461=(*sc_set0.sc_BonesUBO).sc_Bones[l9_460].boneMatrix[0];
float4 l9_462=(*sc_set0.sc_BonesUBO).sc_Bones[l9_460].boneMatrix[1];
float4 l9_463=(*sc_set0.sc_BonesUBO).sc_Bones[l9_460].boneMatrix[2];
float4 l9_464[3];
l9_464[0]=l9_461;
l9_464[1]=l9_462;
l9_464[2]=l9_463;
l9_459=float3(dot(l9_458,l9_464[0]),dot(l9_458,l9_464[1]),dot(l9_458,l9_464[2]));
}
else
{
l9_459=l9_458.xyz;
}
float3 l9_465=l9_459;
float3 l9_466=l9_465;
float l9_467=l9_430.z;
int l9_468=l9_434;
float4 l9_469=l9_427.position;
float3 l9_470=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_471=l9_468;
float4 l9_472=(*sc_set0.sc_BonesUBO).sc_Bones[l9_471].boneMatrix[0];
float4 l9_473=(*sc_set0.sc_BonesUBO).sc_Bones[l9_471].boneMatrix[1];
float4 l9_474=(*sc_set0.sc_BonesUBO).sc_Bones[l9_471].boneMatrix[2];
float4 l9_475[3];
l9_475[0]=l9_472;
l9_475[1]=l9_473;
l9_475[2]=l9_474;
l9_470=float3(dot(l9_469,l9_475[0]),dot(l9_469,l9_475[1]),dot(l9_469,l9_475[2]));
}
else
{
l9_470=l9_469.xyz;
}
float3 l9_476=l9_470;
float3 l9_477=(((l9_444*l9_445)+(l9_455*l9_456))+(l9_466*l9_467))+(l9_476*l9_430.w);
l9_427.position=float4(l9_477.x,l9_477.y,l9_477.z,l9_427.position.w);
int l9_478=l9_431;
float3x3 l9_479=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_478].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_478].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_478].normalMatrix[2].xyz));
float3x3 l9_480=l9_479;
float3x3 l9_481=l9_480;
int l9_482=l9_432;
float3x3 l9_483=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_482].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_482].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_482].normalMatrix[2].xyz));
float3x3 l9_484=l9_483;
float3x3 l9_485=l9_484;
int l9_486=l9_433;
float3x3 l9_487=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_486].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_486].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_486].normalMatrix[2].xyz));
float3x3 l9_488=l9_487;
float3x3 l9_489=l9_488;
int l9_490=l9_434;
float3x3 l9_491=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_490].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_490].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_490].normalMatrix[2].xyz));
float3x3 l9_492=l9_491;
float3x3 l9_493=l9_492;
l9_427.normal=((((l9_481*l9_427.normal)*l9_430.x)+((l9_485*l9_427.normal)*l9_430.y))+((l9_489*l9_427.normal)*l9_430.z))+((l9_493*l9_427.normal)*l9_430.w);
l9_427.tangent=((((l9_481*l9_427.tangent)*l9_430.x)+((l9_485*l9_427.tangent)*l9_430.y))+((l9_489*l9_427.tangent)*l9_430.z))+((l9_493*l9_427.tangent)*l9_430.w);
}
l9_377=l9_427;
float l9_494=(*sc_set0.UserUniforms).voxelization_params_0.y;
float l9_495=(*sc_set0.UserUniforms).voxelization_params_0.z;
float l9_496=(*sc_set0.UserUniforms).voxelization_params_0.w;
float l9_497=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_498=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_499=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_500=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_501=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_502=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float3 l9_503=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float l9_504=l9_494/l9_495;
int l9_505=gl_InstanceIndex;
int l9_506=l9_505;
l9_377.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_377.position;
float3 l9_507=l9_377.position.xyz;
float3 l9_508=float3(float(l9_506%int(l9_496))*l9_494,float(l9_506/int(l9_496))*l9_494,(float(l9_506)*l9_504)+l9_501);
float3 l9_509=l9_507+l9_508;
float4 l9_510=float4(l9_509-l9_503,1.0);
float l9_511=l9_497;
float l9_512=l9_498;
float l9_513=l9_499;
float l9_514=l9_500;
float l9_515=l9_501;
float l9_516=l9_502;
float4x4 l9_517=float4x4(float4(2.0/(l9_512-l9_511),0.0,0.0,(-(l9_512+l9_511))/(l9_512-l9_511)),float4(0.0,2.0/(l9_514-l9_513),0.0,(-(l9_514+l9_513))/(l9_514-l9_513)),float4(0.0,0.0,(-2.0)/(l9_516-l9_515),(-(l9_516+l9_515))/(l9_516-l9_515)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_518=l9_517;
float4 l9_519=l9_518*l9_510;
l9_519.w=1.0;
out.varScreenPos=l9_519;
float4 l9_520=l9_519*1.0;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_520.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_521=l9_520;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_522=dot(l9_521,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_523=l9_522;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_523;
}
}
float4 l9_524=float4(l9_520.x,-l9_520.y,(l9_520.z*0.5)+(l9_520.w*0.5),l9_520.w);
out.gl_Position=l9_524;
param_6=l9_377;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
sc_Vertex_t l9_525=param_6;
sc_Vertex_t l9_526=l9_525;
if ((int(sc_VertexBlending_tmp)!=0))
{
if ((int(sc_VertexBlendingUseNormals_tmp)!=0))
{
sc_Vertex_t l9_527=l9_526;
float3 l9_528=in.blendShape0Pos;
float3 l9_529=in.blendShape0Normal;
float l9_530=(*sc_set0.UserUniforms).weights0.x;
sc_Vertex_t l9_531=l9_527;
float3 l9_532=l9_528;
float l9_533=l9_530;
float3 l9_534=l9_531.position.xyz+(l9_532*l9_533);
l9_531.position=float4(l9_534.x,l9_534.y,l9_534.z,l9_531.position.w);
l9_527=l9_531;
l9_527.normal+=(l9_529*l9_530);
l9_526=l9_527;
sc_Vertex_t l9_535=l9_526;
float3 l9_536=in.blendShape1Pos;
float3 l9_537=in.blendShape1Normal;
float l9_538=(*sc_set0.UserUniforms).weights0.y;
sc_Vertex_t l9_539=l9_535;
float3 l9_540=l9_536;
float l9_541=l9_538;
float3 l9_542=l9_539.position.xyz+(l9_540*l9_541);
l9_539.position=float4(l9_542.x,l9_542.y,l9_542.z,l9_539.position.w);
l9_535=l9_539;
l9_535.normal+=(l9_537*l9_538);
l9_526=l9_535;
sc_Vertex_t l9_543=l9_526;
float3 l9_544=in.blendShape2Pos;
float3 l9_545=in.blendShape2Normal;
float l9_546=(*sc_set0.UserUniforms).weights0.z;
sc_Vertex_t l9_547=l9_543;
float3 l9_548=l9_544;
float l9_549=l9_546;
float3 l9_550=l9_547.position.xyz+(l9_548*l9_549);
l9_547.position=float4(l9_550.x,l9_550.y,l9_550.z,l9_547.position.w);
l9_543=l9_547;
l9_543.normal+=(l9_545*l9_546);
l9_526=l9_543;
}
else
{
sc_Vertex_t l9_551=l9_526;
float3 l9_552=in.blendShape0Pos;
float l9_553=(*sc_set0.UserUniforms).weights0.x;
float3 l9_554=l9_551.position.xyz+(l9_552*l9_553);
l9_551.position=float4(l9_554.x,l9_554.y,l9_554.z,l9_551.position.w);
l9_526=l9_551;
sc_Vertex_t l9_555=l9_526;
float3 l9_556=in.blendShape1Pos;
float l9_557=(*sc_set0.UserUniforms).weights0.y;
float3 l9_558=l9_555.position.xyz+(l9_556*l9_557);
l9_555.position=float4(l9_558.x,l9_558.y,l9_558.z,l9_555.position.w);
l9_526=l9_555;
sc_Vertex_t l9_559=l9_526;
float3 l9_560=in.blendShape2Pos;
float l9_561=(*sc_set0.UserUniforms).weights0.z;
float3 l9_562=l9_559.position.xyz+(l9_560*l9_561);
l9_559.position=float4(l9_562.x,l9_562.y,l9_562.z,l9_559.position.w);
l9_526=l9_559;
sc_Vertex_t l9_563=l9_526;
float3 l9_564=in.blendShape3Pos;
float l9_565=(*sc_set0.UserUniforms).weights0.w;
float3 l9_566=l9_563.position.xyz+(l9_564*l9_565);
l9_563.position=float4(l9_566.x,l9_566.y,l9_566.z,l9_563.position.w);
l9_526=l9_563;
sc_Vertex_t l9_567=l9_526;
float3 l9_568=in.blendShape4Pos;
float l9_569=(*sc_set0.UserUniforms).weights1.x;
float3 l9_570=l9_567.position.xyz+(l9_568*l9_569);
l9_567.position=float4(l9_570.x,l9_570.y,l9_570.z,l9_567.position.w);
l9_526=l9_567;
sc_Vertex_t l9_571=l9_526;
float3 l9_572=in.blendShape5Pos;
float l9_573=(*sc_set0.UserUniforms).weights1.y;
float3 l9_574=l9_571.position.xyz+(l9_572*l9_573);
l9_571.position=float4(l9_574.x,l9_574.y,l9_574.z,l9_571.position.w);
l9_526=l9_571;
}
}
l9_525=l9_526;
sc_Vertex_t l9_575=l9_525;
if (sc_SkinBonesCount_tmp>0)
{
float4 l9_576=float4(0.0);
if (sc_SkinBonesCount_tmp>0)
{
l9_576=float4(1.0,fract(in.boneData.yzw));
l9_576.x-=dot(l9_576.yzw,float3(1.0));
}
float4 l9_577=l9_576;
float4 l9_578=l9_577;
int l9_579=int(in.boneData.x);
int l9_580=int(in.boneData.y);
int l9_581=int(in.boneData.z);
int l9_582=int(in.boneData.w);
int l9_583=l9_579;
float4 l9_584=l9_575.position;
float3 l9_585=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_586=l9_583;
float4 l9_587=(*sc_set0.sc_BonesUBO).sc_Bones[l9_586].boneMatrix[0];
float4 l9_588=(*sc_set0.sc_BonesUBO).sc_Bones[l9_586].boneMatrix[1];
float4 l9_589=(*sc_set0.sc_BonesUBO).sc_Bones[l9_586].boneMatrix[2];
float4 l9_590[3];
l9_590[0]=l9_587;
l9_590[1]=l9_588;
l9_590[2]=l9_589;
l9_585=float3(dot(l9_584,l9_590[0]),dot(l9_584,l9_590[1]),dot(l9_584,l9_590[2]));
}
else
{
l9_585=l9_584.xyz;
}
float3 l9_591=l9_585;
float3 l9_592=l9_591;
float l9_593=l9_578.x;
int l9_594=l9_580;
float4 l9_595=l9_575.position;
float3 l9_596=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_597=l9_594;
float4 l9_598=(*sc_set0.sc_BonesUBO).sc_Bones[l9_597].boneMatrix[0];
float4 l9_599=(*sc_set0.sc_BonesUBO).sc_Bones[l9_597].boneMatrix[1];
float4 l9_600=(*sc_set0.sc_BonesUBO).sc_Bones[l9_597].boneMatrix[2];
float4 l9_601[3];
l9_601[0]=l9_598;
l9_601[1]=l9_599;
l9_601[2]=l9_600;
l9_596=float3(dot(l9_595,l9_601[0]),dot(l9_595,l9_601[1]),dot(l9_595,l9_601[2]));
}
else
{
l9_596=l9_595.xyz;
}
float3 l9_602=l9_596;
float3 l9_603=l9_602;
float l9_604=l9_578.y;
int l9_605=l9_581;
float4 l9_606=l9_575.position;
float3 l9_607=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_608=l9_605;
float4 l9_609=(*sc_set0.sc_BonesUBO).sc_Bones[l9_608].boneMatrix[0];
float4 l9_610=(*sc_set0.sc_BonesUBO).sc_Bones[l9_608].boneMatrix[1];
float4 l9_611=(*sc_set0.sc_BonesUBO).sc_Bones[l9_608].boneMatrix[2];
float4 l9_612[3];
l9_612[0]=l9_609;
l9_612[1]=l9_610;
l9_612[2]=l9_611;
l9_607=float3(dot(l9_606,l9_612[0]),dot(l9_606,l9_612[1]),dot(l9_606,l9_612[2]));
}
else
{
l9_607=l9_606.xyz;
}
float3 l9_613=l9_607;
float3 l9_614=l9_613;
float l9_615=l9_578.z;
int l9_616=l9_582;
float4 l9_617=l9_575.position;
float3 l9_618=float3(0.0);
if (sc_SkinBonesCount_tmp>0)
{
int l9_619=l9_616;
float4 l9_620=(*sc_set0.sc_BonesUBO).sc_Bones[l9_619].boneMatrix[0];
float4 l9_621=(*sc_set0.sc_BonesUBO).sc_Bones[l9_619].boneMatrix[1];
float4 l9_622=(*sc_set0.sc_BonesUBO).sc_Bones[l9_619].boneMatrix[2];
float4 l9_623[3];
l9_623[0]=l9_620;
l9_623[1]=l9_621;
l9_623[2]=l9_622;
l9_618=float3(dot(l9_617,l9_623[0]),dot(l9_617,l9_623[1]),dot(l9_617,l9_623[2]));
}
else
{
l9_618=l9_617.xyz;
}
float3 l9_624=l9_618;
float3 l9_625=(((l9_592*l9_593)+(l9_603*l9_604))+(l9_614*l9_615))+(l9_624*l9_578.w);
l9_575.position=float4(l9_625.x,l9_625.y,l9_625.z,l9_575.position.w);
int l9_626=l9_579;
float3x3 l9_627=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_626].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_626].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_626].normalMatrix[2].xyz));
float3x3 l9_628=l9_627;
float3x3 l9_629=l9_628;
int l9_630=l9_580;
float3x3 l9_631=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_630].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_630].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_630].normalMatrix[2].xyz));
float3x3 l9_632=l9_631;
float3x3 l9_633=l9_632;
int l9_634=l9_581;
float3x3 l9_635=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_634].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_634].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_634].normalMatrix[2].xyz));
float3x3 l9_636=l9_635;
float3x3 l9_637=l9_636;
int l9_638=l9_582;
float3x3 l9_639=float3x3(float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_638].normalMatrix[0].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_638].normalMatrix[1].xyz),float3((*sc_set0.sc_BonesUBO).sc_Bones[l9_638].normalMatrix[2].xyz));
float3x3 l9_640=l9_639;
float3x3 l9_641=l9_640;
l9_575.normal=((((l9_629*l9_575.normal)*l9_578.x)+((l9_633*l9_575.normal)*l9_578.y))+((l9_637*l9_575.normal)*l9_578.z))+((l9_641*l9_575.normal)*l9_578.w);
l9_575.tangent=((((l9_629*l9_575.tangent)*l9_578.x)+((l9_633*l9_575.tangent)*l9_578.y))+((l9_637*l9_575.tangent)*l9_578.z))+((l9_641*l9_575.tangent)*l9_578.w);
}
l9_525=l9_575;
float3 l9_642=(*sc_set0.UserUniforms).voxelization_params_camera_pos;
float2 l9_643=((l9_525.position.xy/float2(l9_525.position.w))*0.5)+float2(0.5);
out.varPackedTex=float4(l9_643.x,l9_643.y,out.varPackedTex.z,out.varPackedTex.w);
l9_525.position=(*sc_set0.UserUniforms).sc_ModelMatrixVoxelization*l9_525.position;
float3 l9_644=l9_525.position.xyz-l9_642;
l9_525.position=float4(l9_644.x,l9_644.y,l9_644.z,l9_525.position.w);
out.varPos=l9_525.position.xyz;
out.varNormal=normalize(l9_525.normal);
float l9_645=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.x;
float l9_646=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.y;
float l9_647=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.z;
float l9_648=(*sc_set0.UserUniforms).voxelization_params_frustum_lrbt.w;
float l9_649=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.x;
float l9_650=(*sc_set0.UserUniforms).voxelization_params_frustum_nf.y;
float l9_651=l9_645;
float l9_652=l9_646;
float l9_653=l9_647;
float l9_654=l9_648;
float l9_655=l9_649;
float l9_656=l9_650;
float4x4 l9_657=float4x4(float4(2.0/(l9_652-l9_651),0.0,0.0,(-(l9_652+l9_651))/(l9_652-l9_651)),float4(0.0,2.0/(l9_654-l9_653),0.0,(-(l9_654+l9_653))/(l9_654-l9_653)),float4(0.0,0.0,(-2.0)/(l9_656-l9_655),(-(l9_656+l9_655))/(l9_656-l9_655)),float4(0.0,0.0,0.0,1.0));
float4x4 l9_658=l9_657;
float4 l9_659=float4(0.0);
float3 l9_660=(l9_658*l9_525.position).xyz;
l9_659=float4(l9_660.x,l9_660.y,l9_660.z,l9_659.w);
l9_659.w=1.0;
out.varScreenPos=l9_659;
float4 l9_661=l9_659*1.0;
float4 l9_662=l9_661;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_662.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
if (sc_StereoRenderingMode_tmp>0)
{
out.varStereoViewID=gl_InstanceIndex%2;
}
float4 l9_663=l9_662;
if (sc_StereoRenderingMode_tmp==1)
{
float l9_664=dot(l9_663,(*sc_set0.UserUniforms).sc_StereoClipPlanes[gl_InstanceIndex%2]);
float l9_665=l9_664;
if (sc_StereoRendering_IsClipDistanceEnabled_tmp==1)
{
}
else
{
out.varClipDistance=l9_665;
}
}
float4 l9_666=float4(l9_662.x,-l9_662.y,(l9_662.z*0.5)+(l9_662.w*0.5),l9_662.w);
out.gl_Position=l9_666;
param_6=l9_525;
}
}
v=param_6;
if (PreviewInfo.Saved)
{
out.PreviewVertexColor=float4(PreviewInfo.Color.xyz,1.0);
out.PreviewVertexSaved=1.0;
}
return out;
}
} // VERTEX SHADER


namespace SNAP_FS {
struct ssGlobals
{
float gTimeElapsed;
float gTimeDelta;
float gTimeElapsedShifted;
float2 Surface_UVCoord0;
};
struct sc_PointLight_t
{
int falloffEnabled;
float falloffEndDistance;
float negRcpFalloffEndDistance4;
float angleScale;
float angleOffset;
float3 direction;
float3 position;
float4 color;
};
struct sc_DirectionalLight_t
{
float3 direction;
float4 color;
};
struct sc_AmbientLight_t
{
float3 color;
float intensity;
};
struct sc_SphericalGaussianLight_t
{
float3 color;
float sharpness;
float3 axis;
};
struct sc_LightEstimationData_t
{
sc_SphericalGaussianLight_t sg[12];
float3 ambientLight;
};
struct sc_Camera_t
{
float3 position;
float aspect;
float2 clipPlanes;
};
struct userUniformsObj
{
sc_PointLight_t sc_PointLights[3];
sc_DirectionalLight_t sc_DirectionalLights[5];
sc_AmbientLight_t sc_AmbientLights[3];
sc_LightEstimationData_t sc_LightEstimationData;
float4 sc_EnvmapDiffuseSize;
float4 sc_EnvmapDiffuseDims;
float4 sc_EnvmapDiffuseView;
float4 sc_EnvmapSpecularSize;
float4 sc_EnvmapSpecularDims;
float4 sc_EnvmapSpecularView;
float3 sc_EnvmapRotation;
float sc_EnvmapExposure;
float3 sc_Sh[9];
float sc_ShIntensity;
float4 sc_Time;
float4 sc_UniformConstants;
float4 sc_GeometryInfo;
float4x4 sc_ModelViewProjectionMatrixArray[2];
float4x4 sc_ModelViewProjectionMatrixInverseArray[2];
float4x4 sc_ViewProjectionMatrixArray[2];
float4x4 sc_ViewProjectionMatrixInverseArray[2];
float4x4 sc_ModelViewMatrixArray[2];
float4x4 sc_ModelViewMatrixInverseArray[2];
float3x3 sc_ViewNormalMatrixArray[2];
float3x3 sc_ViewNormalMatrixInverseArray[2];
float4x4 sc_ProjectionMatrixArray[2];
float4x4 sc_ProjectionMatrixInverseArray[2];
float4x4 sc_ViewMatrixArray[2];
float4x4 sc_ViewMatrixInverseArray[2];
float4x4 sc_PrevFrameViewProjectionMatrixArray[2];
float4x4 sc_ModelMatrix;
float4x4 sc_ModelMatrixInverse;
float3x3 sc_NormalMatrix;
float3x3 sc_NormalMatrixInverse;
float4x4 sc_PrevFrameModelMatrix;
float4x4 sc_PrevFrameModelMatrixInverse;
float3 sc_LocalAabbMin;
float3 sc_LocalAabbMax;
float3 sc_WorldAabbMin;
float3 sc_WorldAabbMax;
float4 sc_WindowToViewportTransform;
float4 sc_CurrentRenderTargetDims;
sc_Camera_t sc_Camera;
float sc_ShadowDensity;
float4 sc_ShadowColor;
float4x4 sc_ProjectorMatrix;
float shaderComplexityValue;
float4 weights0;
float4 weights1;
float4 weights2;
float4 sc_StereoClipPlanes[2];
int sc_FallbackInstanceID;
float2 sc_TAAJitterOffset;
float strandWidth;
float strandTaper;
float4 sc_StrandDataMapTextureSize;
float clumpInstanceCount;
float clumpRadius;
float clumpTipScale;
float hairstyleInstanceCount;
float hairstyleNoise;
float4 sc_ScreenTextureSize;
float4 sc_ScreenTextureDims;
float4 sc_ScreenTextureView;
float4 voxelization_params_0;
float4 voxelization_params_frustum_lrbt;
float4 voxelization_params_frustum_nf;
float3 voxelization_params_camera_pos;
float4x4 sc_ModelMatrixVoxelization;
float correctedIntensity;
float4 intensityTextureSize;
float4 intensityTextureDims;
float4 intensityTextureView;
float3x3 intensityTextureTransform;
float4 intensityTextureUvMinMax;
float4 intensityTextureBorderColor;
float reflBlurWidth;
float reflBlurMinRough;
float reflBlurMaxRough;
int overrideTimeEnabled;
float overrideTimeElapsed[32];
float overrideTimeDelta;
int PreviewEnabled;
int PreviewNodeID;
float alphaTestThreshold;
float startWidth;
float endWidth;
int visualStyle;
float4 startColor;
float4 endColor;
float maxAlpha;
int Port_Value_N008;
float3 Port_Import_N042;
float3 Port_Import_N043;
float Port_Import_N020;
float Port_Import_N021;
float Port_Import_N019;
float Port_Input1_N014;
float Port_Import_N044;
float3 Port_Import_N052;
float3 Port_Import_N016;
float Port_Value3_N040;
float Port_Import_N064;
float3 Port_Import_N028;
float Port_Value3_N060;
float Port_Import_N074;
float4 Port_Import_N032;
float4 Port_Import_N033;
float Port_Import_N034;
float Port_Import_N076;
float Port_Position1_N073;
float Port_Value2_N067;
float Port_Position2_N073;
float Port_Position1_N070;
float Port_Position1_N066;
float4 Port_Value0_N077;
float Port_Position1_N077;
float4 Port_Value2_N077;
};
struct ssPreviewInfo
{
float4 Color;
bool Saved;
};
struct sc_Bone_t
{
float4 boneMatrix[3];
float4 normalMatrix[3];
};
struct sc_Bones_obj
{
sc_Bone_t sc_Bones[1];
};
struct sc_Set0
{
constant sc_Bones_obj* sc_BonesUBO [[id(0)]];
texture2d<float> intensityTexture [[id(1)]];
texture2d<float> sc_ScreenTexture [[id(13)]];
sampler intensityTextureSmpSC [[id(16)]];
sampler sc_ScreenTextureSmpSC [[id(21)]];
constant userUniformsObj* UserUniforms [[id(24)]];
};
struct main_frag_out
{
float4 FragColor0 [[color(0)]];
float4 FragColor1 [[color(1)]];
float4 FragColor2 [[color(2)]];
float4 FragColor3 [[color(3)]];
};
struct main_frag_in
{
float3 varPos [[user(locn0)]];
float3 varNormal [[user(locn1)]];
float4 varTangent [[user(locn2)]];
float4 varPackedTex [[user(locn3)]];
float4 varScreenPos [[user(locn4)]];
float2 varScreenTexturePos [[user(locn5)]];
float varViewSpaceDepth [[user(locn6)]];
float2 varShadowTex [[user(locn7)]];
int varStereoViewID [[user(locn8)]];
float varClipDistance [[user(locn9)]];
float4 varColor [[user(locn10)]];
float4 PreviewVertexColor [[user(locn11)]];
float PreviewVertexSaved [[user(locn12)]];
};
// Implementation of the GLSL mod() function,which is slightly different than Metal fmod()
template<typename Tx,typename Ty>
Tx mod(Tx x,Ty y)
{
return x-y*floor(x/y);
}
float transformSingleColor(thread const float& original,thread const float& intMap,thread const float& target)
{
if (((int(BLEND_MODE_REALISTIC_tmp)!=0)||(int(BLEND_MODE_FORGRAY_tmp)!=0))||(int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
return original/pow(1.0-target,intMap);
}
else
{
if ((int(BLEND_MODE_DIVISION_tmp)!=0))
{
return original/(1.0-target);
}
else
{
if ((int(BLEND_MODE_BRIGHT_tmp)!=0))
{
return original/pow(1.0-target,2.0-(2.0*original));
}
}
}
return 0.0;
}
float3 transformColor(thread const float& yValue,thread const float3& original,thread const float3& target,thread const float& weight,thread const float& intMap)
{
if ((int(BLEND_MODE_INTENSE_tmp)!=0))
{
float3 param=original;
float3 l9_0=param;
float4 l9_1;
if (l9_0.y<l9_0.z)
{
l9_1=float4(l9_0.zy,-1.0,0.66666669);
}
else
{
l9_1=float4(l9_0.yz,0.0,-0.33333334);
}
float4 l9_2=l9_1;
float4 l9_3;
if (l9_0.x<l9_2.x)
{
l9_3=float4(l9_2.xyw,l9_0.x);
}
else
{
l9_3=float4(l9_0.x,l9_2.yzx);
}
float4 l9_4=l9_3;
float l9_5=l9_4.x-fast::min(l9_4.w,l9_4.y);
float l9_6=abs(((l9_4.w-l9_4.y)/((6.0*l9_5)+1e-07))+l9_4.z);
float l9_7=l9_4.x;
float3 l9_8=float3(l9_6,l9_5,l9_7);
float3 l9_9=l9_8;
float l9_10=l9_9.z-(l9_9.y*0.5);
float l9_11=l9_9.y/((1.0-abs((2.0*l9_10)-1.0))+1e-07);
float3 l9_12=float3(l9_9.x,l9_11,l9_10);
float3 hslOrig=l9_12;
float3 res=float3(0.0);
res.x=target.x;
res.y=target.y;
res.z=hslOrig.z;
float3 param_1=res;
float l9_13=param_1.x;
float l9_14=abs((6.0*l9_13)-3.0)-1.0;
float l9_15=2.0-abs((6.0*l9_13)-2.0);
float l9_16=2.0-abs((6.0*l9_13)-4.0);
float3 l9_17=fast::clamp(float3(l9_14,l9_15,l9_16),float3(0.0),float3(1.0));
float3 l9_18=l9_17;
float l9_19=(1.0-abs((2.0*param_1.z)-1.0))*param_1.y;
l9_18=((l9_18-float3(0.5))*l9_19)+float3(param_1.z);
float3 l9_20=l9_18;
res=l9_20;
float3 resColor=mix(original,res,float3(weight));
return resColor;
}
else
{
float3 tmpColor=float3(0.0);
float param_2=yValue;
float param_3=intMap;
float param_4=target.x;
tmpColor.x=transformSingleColor(param_2,param_3,param_4);
float param_5=yValue;
float param_6=intMap;
float param_7=target.y;
tmpColor.y=transformSingleColor(param_5,param_6,param_7);
float param_8=yValue;
float param_9=intMap;
float param_10=target.z;
tmpColor.z=transformSingleColor(param_8,param_9,param_10);
tmpColor=fast::clamp(tmpColor,float3(0.0),float3(1.0));
float3 resColor_1=mix(original,tmpColor,float3(weight));
return resColor_1;
}
}
float3 definedBlend(thread const float3& a,thread const float3& b,thread int& varStereoViewID,constant userUniformsObj& UserUniforms,thread texture2d<float> intensityTexture,thread sampler intensityTextureSmpSC)
{
if ((int(BLEND_MODE_LIGHTEN_tmp)!=0))
{
return fast::max(a,b);
}
else
{
if ((int(BLEND_MODE_DARKEN_tmp)!=0))
{
return fast::min(a,b);
}
else
{
if ((int(BLEND_MODE_DIVIDE_tmp)!=0))
{
return b/a;
}
else
{
if ((int(BLEND_MODE_AVERAGE_tmp)!=0))
{
return (a+b)*0.5;
}
else
{
if ((int(BLEND_MODE_SUBTRACT_tmp)!=0))
{
return fast::max((a+b)-float3(1.0),float3(0.0));
}
else
{
if ((int(BLEND_MODE_DIFFERENCE_tmp)!=0))
{
return abs(a-b);
}
else
{
if ((int(BLEND_MODE_NEGATION_tmp)!=0))
{
return float3(1.0)-abs((float3(1.0)-a)-b);
}
else
{
if ((int(BLEND_MODE_EXCLUSION_tmp)!=0))
{
return (a+b)-((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_OVERLAY_tmp)!=0))
{
float l9_0;
if (a.x<0.5)
{
l9_0=(2.0*a.x)*b.x;
}
else
{
l9_0=1.0-((2.0*(1.0-a.x))*(1.0-b.x));
}
float l9_1=l9_0;
float l9_2;
if (a.y<0.5)
{
l9_2=(2.0*a.y)*b.y;
}
else
{
l9_2=1.0-((2.0*(1.0-a.y))*(1.0-b.y));
}
float l9_3=l9_2;
float l9_4;
if (a.z<0.5)
{
l9_4=(2.0*a.z)*b.z;
}
else
{
l9_4=1.0-((2.0*(1.0-a.z))*(1.0-b.z));
}
return float3(l9_1,l9_3,l9_4);
}
else
{
if ((int(BLEND_MODE_SOFT_LIGHT_tmp)!=0))
{
return (((float3(1.0)-(b*2.0))*a)*a)+((a*2.0)*b);
}
else
{
if ((int(BLEND_MODE_HARD_LIGHT_tmp)!=0))
{
float l9_5;
if (b.x<0.5)
{
l9_5=(2.0*b.x)*a.x;
}
else
{
l9_5=1.0-((2.0*(1.0-b.x))*(1.0-a.x));
}
float l9_6=l9_5;
float l9_7;
if (b.y<0.5)
{
l9_7=(2.0*b.y)*a.y;
}
else
{
l9_7=1.0-((2.0*(1.0-b.y))*(1.0-a.y));
}
float l9_8=l9_7;
float l9_9;
if (b.z<0.5)
{
l9_9=(2.0*b.z)*a.z;
}
else
{
l9_9=1.0-((2.0*(1.0-b.z))*(1.0-a.z));
}
return float3(l9_6,l9_8,l9_9);
}
else
{
if ((int(BLEND_MODE_COLOR_DODGE_tmp)!=0))
{
float l9_10;
if (b.x==1.0)
{
l9_10=b.x;
}
else
{
l9_10=fast::min(a.x/(1.0-b.x),1.0);
}
float l9_11=l9_10;
float l9_12;
if (b.y==1.0)
{
l9_12=b.y;
}
else
{
l9_12=fast::min(a.y/(1.0-b.y),1.0);
}
float l9_13=l9_12;
float l9_14;
if (b.z==1.0)
{
l9_14=b.z;
}
else
{
l9_14=fast::min(a.z/(1.0-b.z),1.0);
}
return float3(l9_11,l9_13,l9_14);
}
else
{
if ((int(BLEND_MODE_COLOR_BURN_tmp)!=0))
{
float l9_15;
if (b.x==0.0)
{
l9_15=b.x;
}
else
{
l9_15=fast::max(1.0-((1.0-a.x)/b.x),0.0);
}
float l9_16=l9_15;
float l9_17;
if (b.y==0.0)
{
l9_17=b.y;
}
else
{
l9_17=fast::max(1.0-((1.0-a.y)/b.y),0.0);
}
float l9_18=l9_17;
float l9_19;
if (b.z==0.0)
{
l9_19=b.z;
}
else
{
l9_19=fast::max(1.0-((1.0-a.z)/b.z),0.0);
}
return float3(l9_16,l9_18,l9_19);
}
else
{
if ((int(BLEND_MODE_LINEAR_LIGHT_tmp)!=0))
{
float l9_20;
if (b.x<0.5)
{
l9_20=fast::max((a.x+(2.0*b.x))-1.0,0.0);
}
else
{
l9_20=fast::min(a.x+(2.0*(b.x-0.5)),1.0);
}
float l9_21=l9_20;
float l9_22;
if (b.y<0.5)
{
l9_22=fast::max((a.y+(2.0*b.y))-1.0,0.0);
}
else
{
l9_22=fast::min(a.y+(2.0*(b.y-0.5)),1.0);
}
float l9_23=l9_22;
float l9_24;
if (b.z<0.5)
{
l9_24=fast::max((a.z+(2.0*b.z))-1.0,0.0);
}
else
{
l9_24=fast::min(a.z+(2.0*(b.z-0.5)),1.0);
}
return float3(l9_21,l9_23,l9_24);
}
else
{
if ((int(BLEND_MODE_VIVID_LIGHT_tmp)!=0))
{
float l9_25;
if (b.x<0.5)
{
float l9_26;
if ((2.0*b.x)==0.0)
{
l9_26=2.0*b.x;
}
else
{
l9_26=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_25=l9_26;
}
else
{
float l9_27;
if ((2.0*(b.x-0.5))==1.0)
{
l9_27=2.0*(b.x-0.5);
}
else
{
l9_27=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_25=l9_27;
}
float l9_28=l9_25;
float l9_29;
if (b.y<0.5)
{
float l9_30;
if ((2.0*b.y)==0.0)
{
l9_30=2.0*b.y;
}
else
{
l9_30=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_29=l9_30;
}
else
{
float l9_31;
if ((2.0*(b.y-0.5))==1.0)
{
l9_31=2.0*(b.y-0.5);
}
else
{
l9_31=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_29=l9_31;
}
float l9_32=l9_29;
float l9_33;
if (b.z<0.5)
{
float l9_34;
if ((2.0*b.z)==0.0)
{
l9_34=2.0*b.z;
}
else
{
l9_34=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_33=l9_34;
}
else
{
float l9_35;
if ((2.0*(b.z-0.5))==1.0)
{
l9_35=2.0*(b.z-0.5);
}
else
{
l9_35=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_33=l9_35;
}
return float3(l9_28,l9_32,l9_33);
}
else
{
if ((int(BLEND_MODE_PIN_LIGHT_tmp)!=0))
{
float l9_36;
if (b.x<0.5)
{
l9_36=fast::min(a.x,2.0*b.x);
}
else
{
l9_36=fast::max(a.x,2.0*(b.x-0.5));
}
float l9_37=l9_36;
float l9_38;
if (b.y<0.5)
{
l9_38=fast::min(a.y,2.0*b.y);
}
else
{
l9_38=fast::max(a.y,2.0*(b.y-0.5));
}
float l9_39=l9_38;
float l9_40;
if (b.z<0.5)
{
l9_40=fast::min(a.z,2.0*b.z);
}
else
{
l9_40=fast::max(a.z,2.0*(b.z-0.5));
}
return float3(l9_37,l9_39,l9_40);
}
else
{
if ((int(BLEND_MODE_HARD_MIX_tmp)!=0))
{
float l9_41;
if (b.x<0.5)
{
float l9_42;
if ((2.0*b.x)==0.0)
{
l9_42=2.0*b.x;
}
else
{
l9_42=fast::max(1.0-((1.0-a.x)/(2.0*b.x)),0.0);
}
l9_41=l9_42;
}
else
{
float l9_43;
if ((2.0*(b.x-0.5))==1.0)
{
l9_43=2.0*(b.x-0.5);
}
else
{
l9_43=fast::min(a.x/(1.0-(2.0*(b.x-0.5))),1.0);
}
l9_41=l9_43;
}
float l9_44=l9_41;
float l9_45;
if (b.y<0.5)
{
float l9_46;
if ((2.0*b.y)==0.0)
{
l9_46=2.0*b.y;
}
else
{
l9_46=fast::max(1.0-((1.0-a.y)/(2.0*b.y)),0.0);
}
l9_45=l9_46;
}
else
{
float l9_47;
if ((2.0*(b.y-0.5))==1.0)
{
l9_47=2.0*(b.y-0.5);
}
else
{
l9_47=fast::min(a.y/(1.0-(2.0*(b.y-0.5))),1.0);
}
l9_45=l9_47;
}
float l9_48=l9_45;
float l9_49;
if (b.z<0.5)
{
float l9_50;
if ((2.0*b.z)==0.0)
{
l9_50=2.0*b.z;
}
else
{
l9_50=fast::max(1.0-((1.0-a.z)/(2.0*b.z)),0.0);
}
l9_49=l9_50;
}
else
{
float l9_51;
if ((2.0*(b.z-0.5))==1.0)
{
l9_51=2.0*(b.z-0.5);
}
else
{
l9_51=fast::min(a.z/(1.0-(2.0*(b.z-0.5))),1.0);
}
l9_49=l9_51;
}
return float3((l9_44<0.5) ? 0.0 : 1.0,(l9_48<0.5) ? 0.0 : 1.0,(l9_49<0.5) ? 0.0 : 1.0);
}
else
{
if ((int(BLEND_MODE_HARD_REFLECT_tmp)!=0))
{
float l9_52;
if (b.x==1.0)
{
l9_52=b.x;
}
else
{
l9_52=fast::min((a.x*a.x)/(1.0-b.x),1.0);
}
float l9_53=l9_52;
float l9_54;
if (b.y==1.0)
{
l9_54=b.y;
}
else
{
l9_54=fast::min((a.y*a.y)/(1.0-b.y),1.0);
}
float l9_55=l9_54;
float l9_56;
if (b.z==1.0)
{
l9_56=b.z;
}
else
{
l9_56=fast::min((a.z*a.z)/(1.0-b.z),1.0);
}
return float3(l9_53,l9_55,l9_56);
}
else
{
if ((int(BLEND_MODE_HARD_GLOW_tmp)!=0))
{
float l9_57;
if (a.x==1.0)
{
l9_57=a.x;
}
else
{
l9_57=fast::min((b.x*b.x)/(1.0-a.x),1.0);
}
float l9_58=l9_57;
float l9_59;
if (a.y==1.0)
{
l9_59=a.y;
}
else
{
l9_59=fast::min((b.y*b.y)/(1.0-a.y),1.0);
}
float l9_60=l9_59;
float l9_61;
if (a.z==1.0)
{
l9_61=a.z;
}
else
{
l9_61=fast::min((b.z*b.z)/(1.0-a.z),1.0);
}
return float3(l9_58,l9_60,l9_61);
}
else
{
if ((int(BLEND_MODE_HARD_PHOENIX_tmp)!=0))
{
return (fast::min(a,b)-fast::max(a,b))+float3(1.0);
}
else
{
if ((int(BLEND_MODE_HUE_tmp)!=0))
{
float3 param=a;
float3 param_1=b;
float3 l9_62=param;
float3 l9_63=l9_62;
float4 l9_64;
if (l9_63.y<l9_63.z)
{
l9_64=float4(l9_63.zy,-1.0,0.66666669);
}
else
{
l9_64=float4(l9_63.yz,0.0,-0.33333334);
}
float4 l9_65=l9_64;
float4 l9_66;
if (l9_63.x<l9_65.x)
{
l9_66=float4(l9_65.xyw,l9_63.x);
}
else
{
l9_66=float4(l9_63.x,l9_65.yzx);
}
float4 l9_67=l9_66;
float l9_68=l9_67.x-fast::min(l9_67.w,l9_67.y);
float l9_69=abs(((l9_67.w-l9_67.y)/((6.0*l9_68)+1e-07))+l9_67.z);
float l9_70=l9_67.x;
float3 l9_71=float3(l9_69,l9_68,l9_70);
float3 l9_72=l9_71;
float l9_73=l9_72.z-(l9_72.y*0.5);
float l9_74=l9_72.y/((1.0-abs((2.0*l9_73)-1.0))+1e-07);
float3 l9_75=float3(l9_72.x,l9_74,l9_73);
float3 l9_76=l9_75;
float3 l9_77=param_1;
float3 l9_78=l9_77;
float4 l9_79;
if (l9_78.y<l9_78.z)
{
l9_79=float4(l9_78.zy,-1.0,0.66666669);
}
else
{
l9_79=float4(l9_78.yz,0.0,-0.33333334);
}
float4 l9_80=l9_79;
float4 l9_81;
if (l9_78.x<l9_80.x)
{
l9_81=float4(l9_80.xyw,l9_78.x);
}
else
{
l9_81=float4(l9_78.x,l9_80.yzx);
}
float4 l9_82=l9_81;
float l9_83=l9_82.x-fast::min(l9_82.w,l9_82.y);
float l9_84=abs(((l9_82.w-l9_82.y)/((6.0*l9_83)+1e-07))+l9_82.z);
float l9_85=l9_82.x;
float3 l9_86=float3(l9_84,l9_83,l9_85);
float3 l9_87=l9_86;
float l9_88=l9_87.z-(l9_87.y*0.5);
float l9_89=l9_87.y/((1.0-abs((2.0*l9_88)-1.0))+1e-07);
float3 l9_90=float3(l9_87.x,l9_89,l9_88);
float3 l9_91=float3(l9_90.x,l9_76.y,l9_76.z);
float l9_92=l9_91.x;
float l9_93=abs((6.0*l9_92)-3.0)-1.0;
float l9_94=2.0-abs((6.0*l9_92)-2.0);
float l9_95=2.0-abs((6.0*l9_92)-4.0);
float3 l9_96=fast::clamp(float3(l9_93,l9_94,l9_95),float3(0.0),float3(1.0));
float3 l9_97=l9_96;
float l9_98=(1.0-abs((2.0*l9_91.z)-1.0))*l9_91.y;
l9_97=((l9_97-float3(0.5))*l9_98)+float3(l9_91.z);
float3 l9_99=l9_97;
float3 l9_100=l9_99;
return l9_100;
}
else
{
if ((int(BLEND_MODE_SATURATION_tmp)!=0))
{
float3 param_2=a;
float3 param_3=b;
float3 l9_101=param_2;
float3 l9_102=l9_101;
float4 l9_103;
if (l9_102.y<l9_102.z)
{
l9_103=float4(l9_102.zy,-1.0,0.66666669);
}
else
{
l9_103=float4(l9_102.yz,0.0,-0.33333334);
}
float4 l9_104=l9_103;
float4 l9_105;
if (l9_102.x<l9_104.x)
{
l9_105=float4(l9_104.xyw,l9_102.x);
}
else
{
l9_105=float4(l9_102.x,l9_104.yzx);
}
float4 l9_106=l9_105;
float l9_107=l9_106.x-fast::min(l9_106.w,l9_106.y);
float l9_108=abs(((l9_106.w-l9_106.y)/((6.0*l9_107)+1e-07))+l9_106.z);
float l9_109=l9_106.x;
float3 l9_110=float3(l9_108,l9_107,l9_109);
float3 l9_111=l9_110;
float l9_112=l9_111.z-(l9_111.y*0.5);
float l9_113=l9_111.y/((1.0-abs((2.0*l9_112)-1.0))+1e-07);
float3 l9_114=float3(l9_111.x,l9_113,l9_112);
float3 l9_115=l9_114;
float l9_116=l9_115.x;
float3 l9_117=param_3;
float3 l9_118=l9_117;
float4 l9_119;
if (l9_118.y<l9_118.z)
{
l9_119=float4(l9_118.zy,-1.0,0.66666669);
}
else
{
l9_119=float4(l9_118.yz,0.0,-0.33333334);
}
float4 l9_120=l9_119;
float4 l9_121;
if (l9_118.x<l9_120.x)
{
l9_121=float4(l9_120.xyw,l9_118.x);
}
else
{
l9_121=float4(l9_118.x,l9_120.yzx);
}
float4 l9_122=l9_121;
float l9_123=l9_122.x-fast::min(l9_122.w,l9_122.y);
float l9_124=abs(((l9_122.w-l9_122.y)/((6.0*l9_123)+1e-07))+l9_122.z);
float l9_125=l9_122.x;
float3 l9_126=float3(l9_124,l9_123,l9_125);
float3 l9_127=l9_126;
float l9_128=l9_127.z-(l9_127.y*0.5);
float l9_129=l9_127.y/((1.0-abs((2.0*l9_128)-1.0))+1e-07);
float3 l9_130=float3(l9_127.x,l9_129,l9_128);
float3 l9_131=float3(l9_116,l9_130.y,l9_115.z);
float l9_132=l9_131.x;
float l9_133=abs((6.0*l9_132)-3.0)-1.0;
float l9_134=2.0-abs((6.0*l9_132)-2.0);
float l9_135=2.0-abs((6.0*l9_132)-4.0);
float3 l9_136=fast::clamp(float3(l9_133,l9_134,l9_135),float3(0.0),float3(1.0));
float3 l9_137=l9_136;
float l9_138=(1.0-abs((2.0*l9_131.z)-1.0))*l9_131.y;
l9_137=((l9_137-float3(0.5))*l9_138)+float3(l9_131.z);
float3 l9_139=l9_137;
float3 l9_140=l9_139;
return l9_140;
}
else
{
if ((int(BLEND_MODE_COLOR_tmp)!=0))
{
float3 param_4=a;
float3 param_5=b;
float3 l9_141=param_5;
float3 l9_142=l9_141;
float4 l9_143;
if (l9_142.y<l9_142.z)
{
l9_143=float4(l9_142.zy,-1.0,0.66666669);
}
else
{
l9_143=float4(l9_142.yz,0.0,-0.33333334);
}
float4 l9_144=l9_143;
float4 l9_145;
if (l9_142.x<l9_144.x)
{
l9_145=float4(l9_144.xyw,l9_142.x);
}
else
{
l9_145=float4(l9_142.x,l9_144.yzx);
}
float4 l9_146=l9_145;
float l9_147=l9_146.x-fast::min(l9_146.w,l9_146.y);
float l9_148=abs(((l9_146.w-l9_146.y)/((6.0*l9_147)+1e-07))+l9_146.z);
float l9_149=l9_146.x;
float3 l9_150=float3(l9_148,l9_147,l9_149);
float3 l9_151=l9_150;
float l9_152=l9_151.z-(l9_151.y*0.5);
float l9_153=l9_151.y/((1.0-abs((2.0*l9_152)-1.0))+1e-07);
float3 l9_154=float3(l9_151.x,l9_153,l9_152);
float3 l9_155=l9_154;
float l9_156=l9_155.x;
float l9_157=l9_155.y;
float3 l9_158=param_4;
float3 l9_159=l9_158;
float4 l9_160;
if (l9_159.y<l9_159.z)
{
l9_160=float4(l9_159.zy,-1.0,0.66666669);
}
else
{
l9_160=float4(l9_159.yz,0.0,-0.33333334);
}
float4 l9_161=l9_160;
float4 l9_162;
if (l9_159.x<l9_161.x)
{
l9_162=float4(l9_161.xyw,l9_159.x);
}
else
{
l9_162=float4(l9_159.x,l9_161.yzx);
}
float4 l9_163=l9_162;
float l9_164=l9_163.x-fast::min(l9_163.w,l9_163.y);
float l9_165=abs(((l9_163.w-l9_163.y)/((6.0*l9_164)+1e-07))+l9_163.z);
float l9_166=l9_163.x;
float3 l9_167=float3(l9_165,l9_164,l9_166);
float3 l9_168=l9_167;
float l9_169=l9_168.z-(l9_168.y*0.5);
float l9_170=l9_168.y/((1.0-abs((2.0*l9_169)-1.0))+1e-07);
float3 l9_171=float3(l9_168.x,l9_170,l9_169);
float3 l9_172=float3(l9_156,l9_157,l9_171.z);
float l9_173=l9_172.x;
float l9_174=abs((6.0*l9_173)-3.0)-1.0;
float l9_175=2.0-abs((6.0*l9_173)-2.0);
float l9_176=2.0-abs((6.0*l9_173)-4.0);
float3 l9_177=fast::clamp(float3(l9_174,l9_175,l9_176),float3(0.0),float3(1.0));
float3 l9_178=l9_177;
float l9_179=(1.0-abs((2.0*l9_172.z)-1.0))*l9_172.y;
l9_178=((l9_178-float3(0.5))*l9_179)+float3(l9_172.z);
float3 l9_180=l9_178;
float3 l9_181=l9_180;
return l9_181;
}
else
{
if ((int(BLEND_MODE_LUMINOSITY_tmp)!=0))
{
float3 param_6=a;
float3 param_7=b;
float3 l9_182=param_6;
float3 l9_183=l9_182;
float4 l9_184;
if (l9_183.y<l9_183.z)
{
l9_184=float4(l9_183.zy,-1.0,0.66666669);
}
else
{
l9_184=float4(l9_183.yz,0.0,-0.33333334);
}
float4 l9_185=l9_184;
float4 l9_186;
if (l9_183.x<l9_185.x)
{
l9_186=float4(l9_185.xyw,l9_183.x);
}
else
{
l9_186=float4(l9_183.x,l9_185.yzx);
}
float4 l9_187=l9_186;
float l9_188=l9_187.x-fast::min(l9_187.w,l9_187.y);
float l9_189=abs(((l9_187.w-l9_187.y)/((6.0*l9_188)+1e-07))+l9_187.z);
float l9_190=l9_187.x;
float3 l9_191=float3(l9_189,l9_188,l9_190);
float3 l9_192=l9_191;
float l9_193=l9_192.z-(l9_192.y*0.5);
float l9_194=l9_192.y/((1.0-abs((2.0*l9_193)-1.0))+1e-07);
float3 l9_195=float3(l9_192.x,l9_194,l9_193);
float3 l9_196=l9_195;
float l9_197=l9_196.x;
float l9_198=l9_196.y;
float3 l9_199=param_7;
float3 l9_200=l9_199;
float4 l9_201;
if (l9_200.y<l9_200.z)
{
l9_201=float4(l9_200.zy,-1.0,0.66666669);
}
else
{
l9_201=float4(l9_200.yz,0.0,-0.33333334);
}
float4 l9_202=l9_201;
float4 l9_203;
if (l9_200.x<l9_202.x)
{
l9_203=float4(l9_202.xyw,l9_200.x);
}
else
{
l9_203=float4(l9_200.x,l9_202.yzx);
}
float4 l9_204=l9_203;
float l9_205=l9_204.x-fast::min(l9_204.w,l9_204.y);
float l9_206=abs(((l9_204.w-l9_204.y)/((6.0*l9_205)+1e-07))+l9_204.z);
float l9_207=l9_204.x;
float3 l9_208=float3(l9_206,l9_205,l9_207);
float3 l9_209=l9_208;
float l9_210=l9_209.z-(l9_209.y*0.5);
float l9_211=l9_209.y/((1.0-abs((2.0*l9_210)-1.0))+1e-07);
float3 l9_212=float3(l9_209.x,l9_211,l9_210);
float3 l9_213=float3(l9_197,l9_198,l9_212.z);
float l9_214=l9_213.x;
float l9_215=abs((6.0*l9_214)-3.0)-1.0;
float l9_216=2.0-abs((6.0*l9_214)-2.0);
float l9_217=2.0-abs((6.0*l9_214)-4.0);
float3 l9_218=fast::clamp(float3(l9_215,l9_216,l9_217),float3(0.0),float3(1.0));
float3 l9_219=l9_218;
float l9_220=(1.0-abs((2.0*l9_213.z)-1.0))*l9_213.y;
l9_219=((l9_219-float3(0.5))*l9_220)+float3(l9_213.z);
float3 l9_221=l9_219;
float3 l9_222=l9_221;
return l9_222;
}
else
{
float3 param_8=a;
float3 param_9=b;
float3 l9_223=param_8;
float l9_224=((0.29899999*l9_223.x)+(0.58700001*l9_223.y))+(0.114*l9_223.z);
float l9_225=l9_224;
float l9_226=1.0;
float l9_227=pow(l9_225,1.0/UserUniforms.correctedIntensity);
int l9_228;
if ((int(intensityTextureHasSwappedViews_tmp)!=0))
{
int l9_229=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_229=0;
}
else
{
l9_229=varStereoViewID;
}
int l9_230=l9_229;
l9_228=1-l9_230;
}
else
{
int l9_231=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_231=0;
}
else
{
l9_231=varStereoViewID;
}
int l9_232=l9_231;
l9_228=l9_232;
}
int l9_233=l9_228;
int l9_234=intensityTextureLayout_tmp;
int l9_235=l9_233;
float2 l9_236=float2(l9_227,0.5);
bool l9_237=(int(SC_USE_UV_TRANSFORM_intensityTexture_tmp)!=0);
float3x3 l9_238=UserUniforms.intensityTextureTransform;
int2 l9_239=int2(SC_SOFTWARE_WRAP_MODE_U_intensityTexture_tmp,SC_SOFTWARE_WRAP_MODE_V_intensityTexture_tmp);
bool l9_240=(int(SC_USE_UV_MIN_MAX_intensityTexture_tmp)!=0);
float4 l9_241=UserUniforms.intensityTextureUvMinMax;
bool l9_242=(int(SC_USE_CLAMP_TO_BORDER_intensityTexture_tmp)!=0);
float4 l9_243=UserUniforms.intensityTextureBorderColor;
float l9_244=0.0;
bool l9_245=l9_242&&(!l9_240);
float l9_246=1.0;
float l9_247=l9_236.x;
int l9_248=l9_239.x;
if (l9_248==1)
{
l9_247=fract(l9_247);
}
else
{
if (l9_248==2)
{
float l9_249=fract(l9_247);
float l9_250=l9_247-l9_249;
float l9_251=step(0.25,fract(l9_250*0.5));
l9_247=mix(l9_249,1.0-l9_249,fast::clamp(l9_251,0.0,1.0));
}
}
l9_236.x=l9_247;
float l9_252=l9_236.y;
int l9_253=l9_239.y;
if (l9_253==1)
{
l9_252=fract(l9_252);
}
else
{
if (l9_253==2)
{
float l9_254=fract(l9_252);
float l9_255=l9_252-l9_254;
float l9_256=step(0.25,fract(l9_255*0.5));
l9_252=mix(l9_254,1.0-l9_254,fast::clamp(l9_256,0.0,1.0));
}
}
l9_236.y=l9_252;
if (l9_240)
{
bool l9_257=l9_242;
bool l9_258;
if (l9_257)
{
l9_258=l9_239.x==3;
}
else
{
l9_258=l9_257;
}
float l9_259=l9_236.x;
float l9_260=l9_241.x;
float l9_261=l9_241.z;
bool l9_262=l9_258;
float l9_263=l9_246;
float l9_264=fast::clamp(l9_259,l9_260,l9_261);
float l9_265=step(abs(l9_259-l9_264),9.9999997e-06);
l9_263*=(l9_265+((1.0-float(l9_262))*(1.0-l9_265)));
l9_259=l9_264;
l9_236.x=l9_259;
l9_246=l9_263;
bool l9_266=l9_242;
bool l9_267;
if (l9_266)
{
l9_267=l9_239.y==3;
}
else
{
l9_267=l9_266;
}
float l9_268=l9_236.y;
float l9_269=l9_241.y;
float l9_270=l9_241.w;
bool l9_271=l9_267;
float l9_272=l9_246;
float l9_273=fast::clamp(l9_268,l9_269,l9_270);
float l9_274=step(abs(l9_268-l9_273),9.9999997e-06);
l9_272*=(l9_274+((1.0-float(l9_271))*(1.0-l9_274)));
l9_268=l9_273;
l9_236.y=l9_268;
l9_246=l9_272;
}
float2 l9_275=l9_236;
bool l9_276=l9_237;
float3x3 l9_277=l9_238;
if (l9_276)
{
l9_275=float2((l9_277*float3(l9_275,1.0)).xy);
}
float2 l9_278=l9_275;
l9_236=l9_278;
float l9_279=l9_236.x;
int l9_280=l9_239.x;
bool l9_281=l9_245;
float l9_282=l9_246;
if ((l9_280==0)||(l9_280==3))
{
float l9_283=l9_279;
float l9_284=0.0;
float l9_285=1.0;
bool l9_286=l9_281;
float l9_287=l9_282;
float l9_288=fast::clamp(l9_283,l9_284,l9_285);
float l9_289=step(abs(l9_283-l9_288),9.9999997e-06);
l9_287*=(l9_289+((1.0-float(l9_286))*(1.0-l9_289)));
l9_283=l9_288;
l9_279=l9_283;
l9_282=l9_287;
}
l9_236.x=l9_279;
l9_246=l9_282;
float l9_290=l9_236.y;
int l9_291=l9_239.y;
bool l9_292=l9_245;
float l9_293=l9_246;
if ((l9_291==0)||(l9_291==3))
{
float l9_294=l9_290;
float l9_295=0.0;
float l9_296=1.0;
bool l9_297=l9_292;
float l9_298=l9_293;
float l9_299=fast::clamp(l9_294,l9_295,l9_296);
float l9_300=step(abs(l9_294-l9_299),9.9999997e-06);
l9_298*=(l9_300+((1.0-float(l9_297))*(1.0-l9_300)));
l9_294=l9_299;
l9_290=l9_294;
l9_293=l9_298;
}
l9_236.y=l9_290;
l9_246=l9_293;
float2 l9_301=l9_236;
int l9_302=l9_234;
int l9_303=l9_235;
float l9_304=l9_244;
float2 l9_305=l9_301;
int l9_306=l9_302;
int l9_307=l9_303;
float3 l9_308=float3(0.0);
if (l9_306==0)
{
l9_308=float3(l9_305,0.0);
}
else
{
if (l9_306==1)
{
l9_308=float3(l9_305.x,(l9_305.y*0.5)+(0.5-(float(l9_307)*0.5)),0.0);
}
else
{
l9_308=float3(l9_305,float(l9_307));
}
}
float3 l9_309=l9_308;
float3 l9_310=l9_309;
float4 l9_311=intensityTexture.sample(intensityTextureSmpSC,l9_310.xy,bias(l9_304));
float4 l9_312=l9_311;
if (l9_242)
{
l9_312=mix(l9_243,l9_312,float4(l9_246));
}
float4 l9_313=l9_312;
float3 l9_314=l9_313.xyz;
float3 l9_315=l9_314;
float l9_316=16.0;
float l9_317=((((l9_315.x*256.0)+l9_315.y)+(l9_315.z/256.0))/257.00391)*l9_316;
float l9_318=l9_317;
if ((int(BLEND_MODE_FORGRAY_tmp)!=0))
{
l9_318=fast::max(l9_318,1.0);
}
if ((int(BLEND_MODE_NOTBRIGHT_tmp)!=0))
{
l9_318=fast::min(l9_318,1.0);
}
float l9_319=l9_225;
float3 l9_320=param_8;
float3 l9_321=param_9;
float l9_322=l9_226;
float l9_323=l9_318;
float3 l9_324=transformColor(l9_319,l9_320,l9_321,l9_322,l9_323);
return l9_324;
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
}
float4 sc_OutputMotionVectorsIfNeeded(thread const float3& surfacePosWorldSpace,thread const float4& finalColor,thread int& varStereoViewID,constant userUniformsObj& UserUniforms)
{
if ((int(sc_MotionVectorsPass_tmp)!=0))
{
float3 param=surfacePosWorldSpace;
int l9_0=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_0=0;
}
else
{
l9_0=varStereoViewID;
}
int l9_1=l9_0;
float4 l9_2=UserUniforms.sc_ViewProjectionMatrixArray[l9_1]*float4(param,1.0);
float2 l9_3=l9_2.xy/float2(l9_2.w);
l9_2=float4(l9_3.x,l9_3.y,l9_2.z,l9_2.w);
int l9_4=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_4=0;
}
else
{
l9_4=varStereoViewID;
}
int l9_5=l9_4;
float4 l9_6=((UserUniforms.sc_PrevFrameViewProjectionMatrixArray[l9_5]*UserUniforms.sc_PrevFrameModelMatrix)*UserUniforms.sc_ModelMatrixInverse)*float4(param,1.0);
float2 l9_7=l9_6.xy/float2(l9_6.w);
l9_6=float4(l9_7.x,l9_7.y,l9_6.z,l9_6.w);
float2 l9_8=(l9_2.xy-l9_6.xy)*0.5;
float2 l9_9=l9_8;
float l9_10=(l9_9.x*5.0)+0.5;
float l9_11=floor(l9_10*65535.0);
float l9_12=floor(l9_11*0.00390625);
float2 l9_13=float2(l9_12/255.0,(l9_11-(l9_12*256.0))/255.0);
float l9_14=(l9_9.y*5.0)+0.5;
float l9_15=floor(l9_14*65535.0);
float l9_16=floor(l9_15*0.00390625);
float2 l9_17=float2(l9_16/255.0,(l9_15-(l9_16*256.0))/255.0);
float4 l9_18=float4(l9_13,l9_17);
float4 l9_19=l9_18;
return l9_19;
}
else
{
return finalColor;
}
}
fragment main_frag_out main_frag(main_frag_in in [[stage_in]],constant sc_Set0& sc_set0 [[buffer(0)]],float4 gl_FragCoord [[position]])
{
main_frag_out out={};
if ((int(sc_DepthOnly_tmp)!=0))
{
return out;
}
if ((sc_StereoRenderingMode_tmp==1)&&(sc_StereoRendering_IsClipDistanceEnabled_tmp==0))
{
if (in.varClipDistance<0.0)
{
discard_fragment();
}
}
ssPreviewInfo PreviewInfo;
PreviewInfo.Color=in.PreviewVertexColor;
PreviewInfo.Saved=((in.PreviewVertexSaved*1.0)!=0.0) ? true : false;
float4 FinalColor=float4(1.0);
ssGlobals Globals;
Globals.gTimeElapsed=(*sc_set0.UserUniforms).sc_Time.x;
Globals.gTimeDelta=(*sc_set0.UserUniforms).sc_Time.y;
Globals.Surface_UVCoord0=in.varPackedTex.xy;
float4 Result_N37=float4(0.0);
float param=0.0;
float4 param_1=float4(0.0);
float4 param_2=float4(0.0);
float4 param_3=float4(0.0);
float4 param_4=float4(0.0);
float4 param_5=float4(0.0);
float4 param_6=float4(0.0);
ssGlobals param_8=Globals;
float l9_0=0.0;
float l9_1=float((*sc_set0.UserUniforms).visualStyle);
l9_0=l9_1;
float l9_2=0.0;
l9_2=l9_0;
param=l9_2;
param=floor(param);
float4 param_7;
if (param==0.0)
{
float4 l9_3=float4(0.0);
float4 l9_4=(*sc_set0.UserUniforms).startColor;
l9_3=l9_4;
float4 l9_5=float4(0.0);
l9_5=l9_3;
float4 l9_6=float4(0.0);
float4 l9_7=(*sc_set0.UserUniforms).endColor;
l9_6=l9_7;
float4 l9_8=float4(0.0);
l9_8=l9_6;
float2 l9_9=float2(0.0);
l9_9=param_8.Surface_UVCoord0;
float l9_10=0.0;
float2 l9_11=l9_9;
float l9_12=l9_11.y;
l9_10=l9_12;
float l9_13=0.0;
l9_13=l9_10;
float4 l9_14=float4(0.0);
l9_14=mix(l9_5,l9_8,float4(l9_13));
float l9_15=0.0;
float l9_16=(*sc_set0.UserUniforms).maxAlpha;
l9_15=l9_16;
float l9_17=0.0;
l9_17=fast::clamp(l9_15,0.0,1.0);
float4 l9_18=float4(0.0);
l9_18=float4(l9_14.xyz.x,l9_14.xyz.y,l9_14.xyz.z,l9_18.w);
l9_18.w=l9_17;
param_1=l9_18;
param_7=param_1;
}
else
{
if (param==1.0)
{
float2 l9_19=float2(0.0);
l9_19=param_8.Surface_UVCoord0;
float l9_20=0.0;
float2 l9_21=l9_19;
float l9_22=l9_21.y;
l9_20=l9_22;
float l9_23=0.0;
l9_23=l9_20;
float4 l9_24=float4(0.0);
float4 l9_25=(*sc_set0.UserUniforms).startColor;
l9_24=l9_25;
float4 l9_26=float4(0.0);
l9_26=l9_24;
float4 l9_27=float4(0.0);
float4 l9_28=(*sc_set0.UserUniforms).endColor;
l9_27=l9_28;
float4 l9_29=float4(0.0);
l9_29=l9_27;
float4 l9_30=float4(0.0);
l9_30=mix(l9_26,l9_29,float4(l9_23));
float l9_31=0.0;
float l9_32=(*sc_set0.UserUniforms).maxAlpha;
l9_31=l9_32;
float l9_33=0.0;
l9_33=fast::clamp(l9_31,0.0,1.0);
float4 l9_34=float4(0.0);
l9_34=float4(l9_30.xyz.x,l9_30.xyz.y,l9_30.xyz.z,l9_34.w);
l9_34.w=l9_33;
float4 l9_35=float4(0.0);
l9_35=float4(l9_30.xyz.x,l9_30.xyz.y,l9_30.xyz.z,l9_35.w);
l9_35.w=(*sc_set0.UserUniforms).Port_Value2_N067;
float4 l9_36=float4(0.0);
float l9_37=l9_23;
float4 l9_38=l9_34;
float l9_39=(*sc_set0.UserUniforms).Port_Position1_N073;
float4 l9_40=l9_35;
float l9_41=(*sc_set0.UserUniforms).Port_Position2_N073;
float4 l9_42=l9_35;
float4 l9_43=l9_34;
l9_37=fast::clamp(l9_37,0.0,1.0);
float4 l9_44;
if (l9_37<l9_39)
{
l9_44=mix(l9_38,l9_40,float4(fast::clamp(l9_37/l9_39,0.0,1.0)));
}
else
{
if (l9_37<l9_41)
{
l9_44=mix(l9_40,l9_42,float4(fast::clamp((l9_37-l9_39)/(l9_41-l9_39),0.0,1.0)));
}
else
{
l9_44=mix(l9_42,l9_43,float4(fast::clamp((l9_37-l9_41)/(1.0-l9_41),0.0,1.0)));
}
}
bool l9_45=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_46;
if (l9_45)
{
l9_46=!PreviewInfo.Saved;
}
else
{
l9_46=l9_45;
}
bool l9_47;
if (l9_46)
{
l9_47=73==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_47=l9_46;
}
if (l9_47)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_44;
PreviewInfo.Color.w=1.0;
}
l9_36=l9_44;
param_2=l9_36;
param_7=param_2;
}
else
{
if (param==2.0)
{
float2 l9_48=float2(0.0);
l9_48=param_8.Surface_UVCoord0;
float l9_49=0.0;
float2 l9_50=l9_48;
float l9_51=l9_50.y;
l9_49=l9_51;
float l9_52=0.0;
l9_52=l9_49;
float4 l9_53=float4(0.0);
float4 l9_54=(*sc_set0.UserUniforms).startColor;
l9_53=l9_54;
float4 l9_55=float4(0.0);
l9_55=l9_53;
float4 l9_56=float4(0.0);
float4 l9_57=(*sc_set0.UserUniforms).endColor;
l9_56=l9_57;
float4 l9_58=float4(0.0);
l9_58=l9_56;
float4 l9_59=float4(0.0);
l9_59=mix(l9_55,l9_58,float4(l9_52));
float l9_60=0.0;
float l9_61=(*sc_set0.UserUniforms).maxAlpha;
l9_60=l9_61;
float l9_62=0.0;
l9_62=fast::clamp(l9_60,0.0,1.0);
float4 l9_63=float4(0.0);
l9_63=float4(l9_59.xyz.x,l9_59.xyz.y,l9_59.xyz.z,l9_63.w);
l9_63.w=l9_62;
float4 l9_64=float4(0.0);
l9_64=float4(l9_59.xyz.x,l9_59.xyz.y,l9_59.xyz.z,l9_64.w);
l9_64.w=(*sc_set0.UserUniforms).Port_Value2_N067;
float4 l9_65=float4(0.0);
float l9_66=l9_52;
float4 l9_67=l9_63;
float l9_68=(*sc_set0.UserUniforms).Port_Position1_N070;
float4 l9_69=l9_64;
float4 l9_70=l9_64;
l9_66=fast::clamp(l9_66,0.0,1.0);
float4 l9_71;
if (l9_66<l9_68)
{
l9_71=mix(l9_67,l9_69,float4(fast::clamp(l9_66/l9_68,0.0,1.0)));
}
else
{
l9_71=mix(l9_69,l9_70,float4(fast::clamp((l9_66-l9_68)/(1.0-l9_68),0.0,1.0)));
}
bool l9_72=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_73;
if (l9_72)
{
l9_73=!PreviewInfo.Saved;
}
else
{
l9_73=l9_72;
}
bool l9_74;
if (l9_73)
{
l9_74=70==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_74=l9_73;
}
if (l9_74)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_71;
PreviewInfo.Color.w=1.0;
}
l9_65=l9_71;
param_3=l9_65;
param_7=param_3;
}
else
{
if (param==3.0)
{
float2 l9_75=float2(0.0);
l9_75=param_8.Surface_UVCoord0;
float l9_76=0.0;
float2 l9_77=l9_75;
float l9_78=l9_77.y;
l9_76=l9_78;
float l9_79=0.0;
l9_79=l9_76;
float4 l9_80=float4(0.0);
float4 l9_81=(*sc_set0.UserUniforms).startColor;
l9_80=l9_81;
float4 l9_82=float4(0.0);
l9_82=l9_80;
float4 l9_83=float4(0.0);
float4 l9_84=(*sc_set0.UserUniforms).endColor;
l9_83=l9_84;
float4 l9_85=float4(0.0);
l9_85=l9_83;
float4 l9_86=float4(0.0);
l9_86=mix(l9_82,l9_85,float4(l9_79));
float4 l9_87=float4(0.0);
l9_87=float4(l9_86.xyz.x,l9_86.xyz.y,l9_86.xyz.z,l9_87.w);
l9_87.w=(*sc_set0.UserUniforms).Port_Value2_N067;
float l9_88=0.0;
float l9_89=(*sc_set0.UserUniforms).maxAlpha;
l9_88=l9_89;
float l9_90=0.0;
l9_90=fast::clamp(l9_88,0.0,1.0);
float4 l9_91=float4(0.0);
l9_91=float4(l9_86.xyz.x,l9_86.xyz.y,l9_86.xyz.z,l9_91.w);
l9_91.w=l9_90;
float4 l9_92=float4(0.0);
float l9_93=l9_79;
float4 l9_94=l9_87;
float l9_95=(*sc_set0.UserUniforms).Port_Position1_N066;
float4 l9_96=l9_87;
float4 l9_97=l9_91;
l9_93=fast::clamp(l9_93,0.0,1.0);
float4 l9_98;
if (l9_93<l9_95)
{
l9_98=mix(l9_94,l9_96,float4(fast::clamp(l9_93/l9_95,0.0,1.0)));
}
else
{
l9_98=mix(l9_96,l9_97,float4(fast::clamp((l9_93-l9_95)/(1.0-l9_95),0.0,1.0)));
}
bool l9_99=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_100;
if (l9_99)
{
l9_100=!PreviewInfo.Saved;
}
else
{
l9_100=l9_99;
}
bool l9_101;
if (l9_100)
{
l9_101=66==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_101=l9_100;
}
if (l9_101)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_98;
PreviewInfo.Color.w=1.0;
}
l9_92=l9_98;
param_4=l9_92;
param_7=param_4;
}
else
{
if (param==4.0)
{
float2 l9_102=float2(0.0);
l9_102=param_8.Surface_UVCoord0;
float l9_103=0.0;
float2 l9_104=l9_102;
float l9_105=l9_104.y;
l9_103=l9_105;
float l9_106=0.0;
l9_106=l9_103;
float4 l9_107=float4(0.0);
float4 l9_108=(*sc_set0.UserUniforms).startColor;
l9_107=l9_108;
float4 l9_109=float4(0.0);
l9_109=l9_107;
float4 l9_110=float4(0.0);
float4 l9_111=(*sc_set0.UserUniforms).endColor;
l9_110=l9_111;
float4 l9_112=float4(0.0);
l9_112=l9_110;
float4 l9_113=float4(0.0);
l9_113=mix(l9_109,l9_112,float4(l9_106));
float l9_114=0.0;
float l9_115=(*sc_set0.UserUniforms).maxAlpha;
l9_114=l9_115;
float l9_116=0.0;
l9_116=fast::clamp(l9_114,0.0,1.0);
float4 l9_117=float4(0.0);
l9_117=float4(l9_113.xyz.x,l9_113.xyz.y,l9_113.xyz.z,l9_117.w);
l9_117.w=l9_116;
float4 l9_118=float4(0.0);
float l9_119=l9_106;
float4 l9_120=(*sc_set0.UserUniforms).Port_Value0_N077;
float l9_121=(*sc_set0.UserUniforms).Port_Position1_N077;
float4 l9_122=l9_117;
float4 l9_123=(*sc_set0.UserUniforms).Port_Value2_N077;
l9_119=fast::clamp(l9_119,0.0,1.0);
float4 l9_124;
if (l9_119<l9_121)
{
l9_124=mix(l9_120,l9_122,float4(fast::clamp(l9_119/l9_121,0.0,1.0)));
}
else
{
l9_124=mix(l9_122,l9_123,float4(fast::clamp((l9_119-l9_121)/(1.0-l9_121),0.0,1.0)));
}
bool l9_125=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_126;
if (l9_125)
{
l9_126=!PreviewInfo.Saved;
}
else
{
l9_126=l9_125;
}
bool l9_127;
if (l9_126)
{
l9_127=77==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_127=l9_126;
}
if (l9_127)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_124;
PreviewInfo.Color.w=1.0;
}
l9_118=l9_124;
param_5=l9_118;
param_7=param_5;
}
else
{
float2 l9_128=float2(0.0);
l9_128=param_8.Surface_UVCoord0;
float l9_129=0.0;
float2 l9_130=l9_128;
float l9_131=l9_130.y;
l9_129=l9_131;
float l9_132=0.0;
l9_132=l9_129;
float4 l9_133=float4(0.0);
float4 l9_134=(*sc_set0.UserUniforms).startColor;
l9_133=l9_134;
float4 l9_135=float4(0.0);
l9_135=l9_133;
float4 l9_136=float4(0.0);
float4 l9_137=(*sc_set0.UserUniforms).endColor;
l9_136=l9_137;
float4 l9_138=float4(0.0);
l9_138=l9_136;
float4 l9_139=float4(0.0);
l9_139=mix(l9_135,l9_138,float4(l9_132));
float l9_140=0.0;
float l9_141=(*sc_set0.UserUniforms).maxAlpha;
l9_140=l9_141;
float l9_142=0.0;
l9_142=fast::clamp(l9_140,0.0,1.0);
float4 l9_143=float4(0.0);
l9_143=float4(l9_139.xyz.x,l9_139.xyz.y,l9_139.xyz.z,l9_143.w);
l9_143.w=l9_142;
float4 l9_144=float4(0.0);
l9_144=float4(l9_139.xyz.x,l9_139.xyz.y,l9_139.xyz.z,l9_144.w);
l9_144.w=(*sc_set0.UserUniforms).Port_Value2_N067;
float4 l9_145=float4(0.0);
float l9_146=l9_132;
float4 l9_147=l9_143;
float l9_148=(*sc_set0.UserUniforms).Port_Position1_N070;
float4 l9_149=l9_144;
float4 l9_150=l9_144;
l9_146=fast::clamp(l9_146,0.0,1.0);
float4 l9_151;
if (l9_146<l9_148)
{
l9_151=mix(l9_147,l9_149,float4(fast::clamp(l9_146/l9_148,0.0,1.0)));
}
else
{
l9_151=mix(l9_149,l9_150,float4(fast::clamp((l9_146-l9_148)/(1.0-l9_148),0.0,1.0)));
}
bool l9_152=(*sc_set0.UserUniforms).PreviewEnabled==1;
bool l9_153;
if (l9_152)
{
l9_153=!PreviewInfo.Saved;
}
else
{
l9_153=l9_152;
}
bool l9_154;
if (l9_153)
{
l9_154=70==(*sc_set0.UserUniforms).PreviewNodeID;
}
else
{
l9_154=l9_153;
}
if (l9_154)
{
PreviewInfo.Saved=true;
PreviewInfo.Color=l9_151;
PreviewInfo.Color.w=1.0;
}
l9_145=l9_151;
param_6=l9_145;
param_7=param_6;
}
}
}
}
}
Result_N37=param_7;
float4 Export_N31=float4(0.0);
Export_N31=Result_N37;
FinalColor=Export_N31;
float param_9=FinalColor.w;
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
if (param_9<(*sc_set0.UserUniforms).alphaTestThreshold)
{
discard_fragment();
}
}
if ((int(ENABLE_STIPPLE_PATTERN_TEST_tmp)!=0))
{
float4 l9_155=gl_FragCoord;
float2 l9_156=floor(mod(l9_155.xy,float2(4.0)));
float l9_157=(mod(dot(l9_156,float2(4.0,1.0))*9.0,16.0)+1.0)/17.0;
if (param_9<l9_157)
{
discard_fragment();
}
}
float4 param_10=FinalColor;
if ((int(sc_ProjectiveShadowsCaster_tmp)!=0))
{
float4 l9_158=param_10;
float4 l9_159=l9_158;
float l9_160=1.0;
if ((((int(sc_BlendMode_Normal_tmp)!=0)||(int(sc_BlendMode_AlphaToCoverage_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaHardware_tmp)!=0))||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_160=l9_159.w;
}
else
{
if ((int(sc_BlendMode_PremultipliedAlpha_tmp)!=0))
{
l9_160=fast::clamp(l9_159.w*2.0,0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_160=fast::clamp(dot(l9_159.xyz,float3(l9_159.w)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AlphaTest_tmp)!=0))
{
l9_160=1.0;
}
else
{
if ((int(sc_BlendMode_Multiply_tmp)!=0))
{
l9_160=(1.0-dot(l9_159.xyz,float3(0.33333001)))*l9_159.w;
}
else
{
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_160=(1.0-fast::clamp(dot(l9_159.xyz,float3(1.0)),0.0,1.0))*l9_159.w;
}
else
{
if ((int(sc_BlendMode_ColoredGlass_tmp)!=0))
{
l9_160=fast::clamp(dot(l9_159.xyz,float3(1.0)),0.0,1.0)*l9_159.w;
}
else
{
if ((int(sc_BlendMode_Add_tmp)!=0))
{
l9_160=fast::clamp(dot(l9_159.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_AddWithAlphaFactor_tmp)!=0))
{
l9_160=fast::clamp(dot(l9_159.xyz,float3(1.0)),0.0,1.0)*l9_159.w;
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0))
{
l9_160=dot(l9_159.xyz,float3(0.33333001))*l9_159.w;
}
else
{
if ((int(sc_BlendMode_Min_tmp)!=0))
{
l9_160=1.0-fast::clamp(dot(l9_159.xyz,float3(1.0)),0.0,1.0);
}
else
{
if ((int(sc_BlendMode_Max_tmp)!=0))
{
l9_160=fast::clamp(dot(l9_159.xyz,float3(1.0)),0.0,1.0);
}
}
}
}
}
}
}
}
}
}
}
}
float l9_161=l9_160;
float l9_162=l9_161;
float l9_163=(*sc_set0.UserUniforms).sc_ShadowDensity*l9_162;
float3 l9_164=mix((*sc_set0.UserUniforms).sc_ShadowColor.xyz,(*sc_set0.UserUniforms).sc_ShadowColor.xyz*l9_158.xyz,float3((*sc_set0.UserUniforms).sc_ShadowColor.w));
float4 l9_165=float4(l9_164.x,l9_164.y,l9_164.z,l9_163);
param_10=l9_165;
}
else
{
if ((int(sc_RenderAlphaToColor_tmp)!=0))
{
param_10=float4(param_10.w);
}
else
{
if ((int(sc_BlendMode_Custom_tmp)!=0))
{
float4 l9_166=param_10;
float4 l9_167=float4(0.0);
float4 l9_168=float4(0.0);
if ((int(sc_FramebufferFetch_tmp)!=0))
{
float4 l9_169=out.FragColor0;
float4 l9_170=l9_169;
l9_168=l9_170;
}
else
{
float4 l9_171=gl_FragCoord;
float2 l9_172=l9_171.xy*(*sc_set0.UserUniforms).sc_CurrentRenderTargetDims.zw;
float2 l9_173=l9_172;
float2 l9_174=float2(0.0);
if (sc_StereoRenderingMode_tmp==1)
{
int l9_175=1;
int l9_176=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_176=0;
}
else
{
l9_176=in.varStereoViewID;
}
int l9_177=l9_176;
int l9_178=l9_177;
float3 l9_179=float3(l9_173,0.0);
int l9_180=l9_175;
int l9_181=l9_178;
if (l9_180==1)
{
l9_179.y=((2.0*l9_179.y)+float(l9_181))-1.0;
}
float2 l9_182=l9_179.xy;
l9_174=l9_182;
}
else
{
l9_174=l9_173;
}
float2 l9_183=l9_174;
float2 l9_184=l9_183;
float2 l9_185=l9_184;
float2 l9_186=l9_185;
float l9_187=0.0;
int l9_188;
if ((int(sc_ScreenTextureHasSwappedViews_tmp)!=0))
{
int l9_189=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_189=0;
}
else
{
l9_189=in.varStereoViewID;
}
int l9_190=l9_189;
l9_188=1-l9_190;
}
else
{
int l9_191=0;
if (sc_StereoRenderingMode_tmp==0)
{
l9_191=0;
}
else
{
l9_191=in.varStereoViewID;
}
int l9_192=l9_191;
l9_188=l9_192;
}
int l9_193=l9_188;
float2 l9_194=l9_186;
int l9_195=sc_ScreenTextureLayout_tmp;
int l9_196=l9_193;
float l9_197=l9_187;
float2 l9_198=l9_194;
int l9_199=l9_195;
int l9_200=l9_196;
float3 l9_201=float3(0.0);
if (l9_199==0)
{
l9_201=float3(l9_198,0.0);
}
else
{
if (l9_199==1)
{
l9_201=float3(l9_198.x,(l9_198.y*0.5)+(0.5-(float(l9_200)*0.5)),0.0);
}
else
{
l9_201=float3(l9_198,float(l9_200));
}
}
float3 l9_202=l9_201;
float3 l9_203=l9_202;
float4 l9_204=sc_set0.sc_ScreenTexture.sample(sc_set0.sc_ScreenTextureSmpSC,l9_203.xy,bias(l9_197));
float4 l9_205=l9_204;
float4 l9_206=l9_205;
l9_168=l9_206;
}
float4 l9_207=l9_168;
float3 l9_208=l9_207.xyz;
float3 l9_209=l9_208;
float3 l9_210=l9_166.xyz;
float3 l9_211=definedBlend(l9_209,l9_210,in.varStereoViewID,(*sc_set0.UserUniforms),sc_set0.intensityTexture,sc_set0.intensityTextureSmpSC);
l9_167=float4(l9_211.x,l9_211.y,l9_211.z,l9_167.w);
float3 l9_212=mix(l9_208,l9_167.xyz,float3(l9_166.w));
l9_167=float4(l9_212.x,l9_212.y,l9_212.z,l9_167.w);
l9_167.w=1.0;
float4 l9_213=l9_167;
param_10=l9_213;
}
else
{
if ((int(sc_Voxelization_tmp)!=0))
{
float4 l9_214=float4(in.varScreenPos.xyz,1.0);
param_10=l9_214;
}
else
{
if ((int(sc_OutputBounds_tmp)!=0))
{
float4 l9_215=gl_FragCoord;
float l9_216=fast::clamp(abs(l9_215.z),0.0,1.0);
float4 l9_217=float4(l9_216,1.0-l9_216,1.0,1.0);
param_10=l9_217;
}
else
{
float4 l9_218=param_10;
float4 l9_219=float4(0.0);
if ((int(sc_BlendMode_MultiplyOriginal_tmp)!=0))
{
l9_219=float4(mix(float3(1.0),l9_218.xyz,float3(l9_218.w)),l9_218.w);
}
else
{
if ((int(sc_BlendMode_Screen_tmp)!=0)||(int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
float l9_220=l9_218.w;
if ((int(sc_BlendMode_PremultipliedAlphaAuto_tmp)!=0))
{
l9_220=fast::clamp(l9_220,0.0,1.0);
}
l9_219=float4(l9_218.xyz*l9_220,l9_220);
}
else
{
l9_219=l9_218;
}
}
float4 l9_221=l9_219;
param_10=l9_221;
}
}
}
}
}
float4 l9_222=param_10;
FinalColor=l9_222;
if ((*sc_set0.UserUniforms).PreviewEnabled==1)
{
if (PreviewInfo.Saved)
{
FinalColor=float4(PreviewInfo.Color);
}
else
{
FinalColor=float4(0.0);
}
}
float4 l9_223=float4(0.0);
l9_223=float4(0.0);
float4 l9_224=l9_223;
float4 Cost=l9_224;
if (Cost.w>0.0)
{
FinalColor=Cost;
}
FinalColor=fast::max(FinalColor,float4(0.0));
float3 param_11=in.varPos;
float4 param_12=FinalColor;
FinalColor=sc_OutputMotionVectorsIfNeeded(param_11,param_12,in.varStereoViewID,(*sc_set0.UserUniforms));
float4 param_13=FinalColor;
float4 l9_225=param_13;
if (sc_ShaderCacheConstant_tmp!=0)
{
l9_225.x+=((*sc_set0.UserUniforms).sc_UniformConstants.x*float(sc_ShaderCacheConstant_tmp));
}
out.FragColor0=l9_225;
return out;
}
} // FRAGMENT SHADER
