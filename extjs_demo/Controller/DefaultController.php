<?php

/**
 * Pimcore
 *
 * This source file is available under two different licenses:
 * - GNU General Public License version 3 (GPLv3)
 * - Pimcore Enterprise License (PEL)
 * Full copyright and license information is available in
 * LICENSE.md which is distributed with this source code.
 *
 *  @copyright  Copyright (c) Pimcore GmbH (http://www.pimcore.org)
 *  @license    http://www.pimcore.org/license     GPLv3 and PEL
 */

namespace App\Controller;

use App\Model\CustomerManagementFramework\Activity\LoginActivity;
use CustomerManagementFrameworkBundle\ActivityManager\ActivityManagerInterface;
use CustomerManagementFrameworkBundle\CustomerDuplicatesService\CustomerDuplicatesServiceInterface;
use CustomerManagementFrameworkBundle\CustomerProvider\CustomerProviderInterface;
use CustomerManagementFrameworkBundle\Model\Activity\GenericActivity;
use CustomerManagementFrameworkBundle\SegmentManager\SegmentManagerInterface;
use Locale;
use Pimcore\Model\Asset;
use Pimcore\Model\DataObject\DemoProduct;
use Sensio\Bundle\FrameworkExtraBundle\Configuration\Template;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Pimcore\Model\DataObject\TestLocale;

class DefaultController extends BaseController
{
    /**
     * @Route("/examples", name="examples")
     *
     * @param Request $request
     * @return Response
     */
    public function examplesAction(Request $request)
    {
        return $this->render('default/examples.html.twig');
    }

    /**
     * @Template
     *
     * @param Request $request
     * @return array
     */
    public function defaultAction(Request $request)
    {
        return [];
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function genericMailAction(Request $request)
    {
        return $this->render('default/generic_mail.html.twig');
    }

    /**
     * @param Request $request
     *
     * @return Response
     */
    public function galleryRenderletAction(Request $request)
    {
        $params = [];
        if ($request->get('id') && $request->get('type') === 'asset') {
            $params['asset'] =  Asset::getById($request->get('id'));
        }

        return $this->render('default/gallery_renderlet.html.twig', $params);
    }

    /**
     * @Route("/academy")
     *     
     */
    public function testAction(){
        /*$asset = new Asset();
        $asset->setParentId(1);
        $asset->setFilename("my-imported-asset.jpg");
        $asset->setData(file_get_contents("https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/cute-cat-photos-1593441022.jpg?crop=1.00xw:0.749xh;0,0.154xh&resize=980:*"));
        $asset->save();*/

        $asset = Asset::getById(409);
        // $asset->setData(file_get_contents("https://i.pinimg.com/564x/db/32/23/db32232ee849096679c32d3392a87694.jpg"));
        //$asset->addMetadata("my-data","text","Good");
        $asset->delete();
        
        return new Response("done");
    }


     /**
     * @Route("/image-check")
     *     
     */
    public function imageCheck(){        

        $asset = Asset\Image::getById(205);
        echo $asset->getThumbnail('demo')->getHtml();
        die();        
        
        return new Response("done");
    }

    public function academyAction(Request $request){    
        $params = [];    
        return $this->render('default/academy.html.twig', $params);        
    }

    /**
     * @Route("/dataobject")
     * @return Response
     */
    public function dataObjectAction(Request $request) {

        $productListing = new DemoProduct\Listing();
        $productListing->setCondition('price > ?', [intval($request->get('from-price'))]);

        $data = [];
        foreach ($productListing as $product) {

            $data[] = [
                'id' => $product->getId(),
                'title' => $product->getTitle(),
                'price' => $product->getPrice()
            ];

        }
        $requestObject = [];
        $requestObject = ["status"=>200,"success"=>true, "data"=>$data];
        return new JsonResponse($requestObject);
    }


    /**
     * @Route("/get-locale")
     * @return Response
     */
    public function getLocaleAction(Request $request) {
        $getLang = ($request->get('lang')) ? $request->get('lang') : "";
        $getLocaleObject = TestLocale::getById(1236);
        echo $getLocaleObject->getTitle($getLang);
        return new Response("done");
    }


    /**
     * @Route("/academy-iframe")
     * @return Response
     */
    public function academyIframeAction() {        
        return new Response("Hello I am from iframe action");
    }

    /**
     * @Route("/custom-panel")
     * @return Response
     */
    public function customPanelAction() {        
        return new Response("Hello I am from custom panel action");
    }

    /**
     * @Route("/customer-crud")
     * @return Response
     */
    public function customerCRUDAction(Request $request, CustomerProviderInterface $customerProvider, ActivityManagerInterface $activity) {        
        
        //CREATE CUSTOMER
        /*$newCustomer = $customerProvider->create([
            "firstname"=>"Rushabh",
            "lastname"=>"R",
            "email"=> "rushabh.r@yopmail.com",
            "active"=>true,
            "password"=>"Test123!@#"
        ]);
        $newCustomer->save();*/

        //GET CUSTOMER GY ID AND SET FIRSTNAME
        /*$customer = $customerProvider->getById(1241);
        $customer->setFirstname("Rushabh");
        $customer->save();*/

        //GET CUSTOMER GY EMAIL AND SET GENDER
        /*$customer = $customerProvider->getActiveCustomerByEmail("rushabh.r@yopmail.com");
        $customer->setGender("male");
        $customer->save();*/

        //ALL CUSTOMER LISTS
        /*$listings = $customerProvider->getList();        
        $listings->setCondition("firstname LIKE ?",["%r%"]);
        $customerProvider->addActiveCondition($listings);

        foreach ($listings as $entry) {
            echo "FIRST NAME ".$entry->getFirstname();
            echo "<br/>";
        }*/

        //CUSTOMER SET ZIP
        // $customer = $customerProvider->getActiveCustomerByEmail("rushabh.r@yopmail.com");
        // $customer->setCountryCode("AT");
        // $customer->setZip('AT-2342');
        // $customer->save();

        //CHECK DUPLICATE
        // $newCustomer = $customerProvider->create([
        //     "firstname"=>"Another Rushabh",
        //     "lastname"=>"R",
        //     "street"=>"AT",
        //     "zip"=>"2343",
        //     // "email"=> "rushabh.r@yopmail.com",
        //     "active"=>true,
        //     "password"=>"Test123!@#"
        // ]);
        // $newCustomer->save();

        //ACTIVITY
        $customer = $customerProvider->getActiveCustomerByEmail("rushabh.r@yopmail.com");
        // $activity->trackActivity(new GenericActivity(
        //     [
        //         "customer"   => $customer->getId(),
        //         "type"       => "SOME TYPE",
        //         "attributes" => [
        //             "attr_1" => "ABC",
        //             "attr_2" => "BBC"
        //         ]
        //     ]
        // ));        
        $activity->trackActivity(new LoginActivity($customer));
        //dd($customerProvider->getList());

        return new Response("customer created successfully!");
    }

     /**
     * @Route("/customer-segment")
     * @return Response
     */
    public function customerSegmentManagerAction(Request $request, CustomerProviderInterface $customerProvider, SegmentManagerInterface $segmentManager) {
        // $group = $segmentManager->createSegmentGroup("my-group");
        // $segment1 = $segmentManager->createCalculatedSegment("segment1",$group);
        // $segment2 = $segmentManager->createCalculatedSegment("segment2",$group);

        $segment = $segmentManager->getSegmentByReference("segment1");
        $customer = $customerProvider->getActiveCustomerByEmail("rushabh.r@yopmail.com");

        $segmentManager->mergeSegments($customer,[$segment],[],null,time(),true);
        $segmentManager->saveMergedSegments($customer);

        return new Response("customer segment created successfully!");
    }


    /**
     * @Route("/customer-duplicate")
     * @return Response
     */
    public function customerDuplicateAction(Request $request, CustomerProviderInterface $customerProvider, CustomerDuplicatesServiceInterface $customerDuplicate) {        
        $customer = $customerProvider->create([
            "firstname"=>"Rushabh",
            "lastname"=>"R",
            "email"=> "rushabh.r@yopmail.com",
            "active"=>true,
            "password"=>"Test123!@#"
        ]);
        $duplicates = $customerDuplicate->getDuplicatesOfCustomer($customer);
        p_r($duplicates);
        
        return new Response("customer segment created successfully!");
    }

     /**
     * @Route("/csvimport/import2")
     * @return Response
     */
    public function importAction2(Request $request): Response
    {        
        dump( $importType = $request->request->get('demoField'));
        dump( $importFile =   $request->files->get('zipFile'));
        exit;
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse|Response
     *
     * @throws Exception
     * @Route("/export-MealCode")
     */
    public function exportAirlineCatCsv(Request $request)
    {

        //$columnNames = $request->get('columnNames'); //string
        $csvTemplatePath = $this->getParameter('kernel.project_dir') . '/var/csvtemplates/'; //Csv Template storage path
        $fileName = 'mealcode_import.csv';

        $fp = fopen($csvTemplatePath . $fileName, 'w');

        $columnNames = ['firstName','level'];
        fputcsv($fp, $columnNames);
        $Mealdata = json_decode($request->get('data'), true);

        foreach ($Mealdata as $meal) {
            $mealCode = '';

            if (isset($meal['mealcode'])) {
                $mealCode = $meal['mealcode'];
                if (is_array($meal['mealcode'])) {
                    $mealCode = implode(',', $meal['mealcode']);
                }
            }

            $row = ['firstName' => $meal['firstName'], 'level' => $meal['level']];

            fputcsv($fp, $row);
        }

        $response = new Response();
        $response->setStatusCode(200);
        $response->headers->set('Content-Type', 'application/json');
        $logData = file_get_contents($csvTemplatePath . $fileName);
        if (file_exists($csvTemplatePath . $fileName)) {
            unlink($csvTemplatePath . $fileName);
        }
        $response->setContent($logData);
        return $response;
    }

    /**
     * @param Request $request
     *
     * @return JsonResponse|Response
     *
     * @throws Exception
     * @Route("/trigger-car-callback")
     */
    public function triggerCarCallback(Request $request)
    {
        $carId          = $request->get("catId");
        $offerDate   = json_decode($request->get("offerDate"));        

        return $this->json(["success" => 'exist', 'errors' => '', "message" => 'message from ajax.']);
    }


    /**
     * @param Request $request
     *
     * @return JsonResponse|Response
     *
     * @throws Exception
     * @Route("/checking-notes")
     */
    public function checkingNotes(){
        $object = \Pimcore\Model\DataObject::getById(1273);

        $note = new \Pimcore\Model\Element\Note();
        $note->setElement($object);
        $note->setDate(time());
        $note->setType("erp_import");
        $note->setTitle("changed availabilities to xyz");
        $note->setUser(0);

        // you can add as much additional data to notes & events as you want
        $note->addData("myText", "text", "Some Text");
        $note->addData("myObject", "object", \Pimcore\Model\DataObject::getById(7));
        $note->addData("myDocument", "document", \Pimcore\Model\DataObject::getById(18));
        //$note->addData("myAsset", "asset", \Pimcore\Model\DataObject::getById(20));

        $note->save();
        dd($note);
    }
    
}

