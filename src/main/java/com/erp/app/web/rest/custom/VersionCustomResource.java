package com.erp.app.web.rest.custom;

import com.codahale.metrics.annotation.Timed;
import com.erp.app.domain.custom.VersionCustom;
import com.erp.app.repository.custom.VersionCustomRepository;
import com.erp.app.repository.search.custom.VersionCustomSearchRepository;
import com.erp.app.web.rest.errors.BadRequestAlertException;
import com.erp.app.web.rest.util.HeaderUtil;
import com.erp.app.web.rest.util.PaginationUtil;
import io.github.jhipster.web.util.ResponseUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Optional;

import static org.elasticsearch.index.query.QueryBuilders.queryStringQuery;

@RestController
@RequestMapping("/api/custom")
public class VersionCustomResource {

	private final Logger log = LoggerFactory.getLogger(VersionCustomResource.class);

    private static final String ENTITY_NAME = "versioncustom";

    private final VersionCustomRepository versioncustomRepository;

    private final VersionCustomSearchRepository versioncustomSearchRepository;

    public VersionCustomResource(VersionCustomRepository versioncustomRepository, VersionCustomSearchRepository versioncustomSearchRepository) {
        this.versioncustomRepository = versioncustomRepository;
        this.versioncustomSearchRepository = versioncustomSearchRepository;
    }

    /**
     * POST  /versioncustoms : Create a new versioncustom.
     *
     * @param versioncustom the versioncustom to create
     * @return the ResponseEntity with status 201 (Created) and with body the new versioncustom, or with status 400 (Bad Request) if the versioncustom has already an ID
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PostMapping("/versioncustoms")
    @Timed
    public ResponseEntity<VersionCustom> createVersionCustom(@Valid @RequestBody VersionCustom versioncustom) throws URISyntaxException {
        log.debug("REST request to save VersionCustom : {}", versioncustom);
        if (versioncustom.getId() != null) {
            throw new BadRequestAlertException("A new versioncustom cannot already have an ID", ENTITY_NAME, "idexists");
        }
        VersionCustom result = versioncustomRepository.save(versioncustom);
        versioncustomSearchRepository.save(result);
        return ResponseEntity.created(new URI("/api/custom/versioncustoms/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * PUT  /versioncustoms : Updates an existing versioncustom.
     *
     * @param versioncustom the versioncustom to update
     * @return the ResponseEntity with status 200 (OK) and with body the updated versioncustom,
     * or with status 400 (Bad Request) if the versioncustom is not valid,
     * or with status 500 (Internal Server Error) if the versioncustom couldn't be updated
     * @throws URISyntaxException if the Location URI syntax is incorrect
     */
    @PutMapping("/versioncustoms")
    @Timed
    public ResponseEntity<VersionCustom> updateVersionCustom(@Valid @RequestBody VersionCustom versioncustom) throws URISyntaxException {
        log.debug("REST request to update VersionCustom : {}", versioncustom);
        if (versioncustom.getId() == null) {
            return createVersionCustom(versioncustom);
        }
        VersionCustom result = versioncustomRepository.save(versioncustom);
        versioncustomSearchRepository.save(result);
        return ResponseEntity.ok()
            .headers(HeaderUtil.createEntityUpdateAlert(ENTITY_NAME, versioncustom.getId().toString()))
            .body(result);
    }

    /**
     * GET  /versioncustoms : get all the versioncustoms.
     *
     * @param pageable the pagination information
     * @return the ResponseEntity with status 200 (OK) and the list of versioncustoms in body
     */
    @GetMapping("/versioncustoms")
    @Timed
    public ResponseEntity<List<VersionCustom>> getAllVersionCustoms(Pageable pageable) {
        log.debug("REST request to get a page of VersionCustoms");
        Page<VersionCustom> page = versioncustomRepository.findAll(pageable);
        HttpHeaders headers = PaginationUtil.generatePaginationHttpHeaders(page, "/api/custom/versioncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }

    /**
     * GET  /versioncustoms/:id : get the "id" versioncustom.
     *
     * @param id the id of the versioncustom to retrieve
     * @return the ResponseEntity with status 200 (OK) and with body the versioncustom, or with status 404 (Not Found)
     */
    @GetMapping("/versioncustoms/{id}")
    @Timed
    public ResponseEntity<VersionCustom> getVersionCustom(@PathVariable String id) {
        log.debug("REST request to get VersionCustom : {}", id);
        VersionCustom versioncustom = versioncustomRepository.findOne(id);
        return ResponseUtil.wrapOrNotFound(Optional.ofNullable(versioncustom));
    }

    /**
     * DELETE  /versioncustoms/:id : delete the "id" versioncustom.
     *
     * @param id the id of the versioncustom to delete
     * @return the ResponseEntity with status 200 (OK)
     */
    @DeleteMapping("/versioncustoms/{id}")
    @Timed
    public ResponseEntity<Void> deleteVersionCustom(@PathVariable String id) {
        log.debug("REST request to delete VersionCustom : {}", id);
        versioncustomRepository.delete(id);
        versioncustomSearchRepository.delete(id);
        return ResponseEntity.ok().headers(HeaderUtil.createEntityDeletionAlert(ENTITY_NAME, id)).build();
    }

    /**
     * SEARCH  /_search/versioncustoms?query=:query : search for the versioncustom corresponding
     * to the query.
     *
     * @param query the query of the versioncustom search
     * @param pageable the pagination information
     * @return the result of the search
     */
    @GetMapping("/_search/versioncustoms")
    @Timed
    public ResponseEntity<List<VersionCustom>> searchVersionCustoms(@RequestParam String query, Pageable pageable) {
        log.debug("REST request to search for a page of VersionCustoms for query {}", query);
        Page<VersionCustom> page = versioncustomSearchRepository.search(queryStringQuery(query), pageable);
        HttpHeaders headers = PaginationUtil.generateSearchPaginationHttpHeaders(query, page, "/api/custom/_search/versioncustoms");
        return new ResponseEntity<>(page.getContent(), headers, HttpStatus.OK);
    }


}
